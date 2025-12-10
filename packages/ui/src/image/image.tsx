"use client";

import * as React from "react";

import { createContext } from "../utils/create-context";
import { useIsHydrated } from "../utils/use-is-hydrated";

export const ImageLoadingStatus = {
  Idle: "idle",
  Loading: "loading",
  Loaded: "loaded",
  Error: "error",
} as const;

export type ImageLoadingStatus =
  (typeof ImageLoadingStatus)[keyof typeof ImageLoadingStatus];

export interface ImageContext {
  status: ImageLoadingStatus;
  onStatusChange: (status: ImageLoadingStatus) => void;
}

export const [ImageContextProvider, useImageContext] =
  createContext<ImageContext>({
    strict: false,
    defaultValue: {
      status: ImageLoadingStatus.Idle,
      onStatusChange: () => {
        /* empty */
      },
    },
    namespace: "Image",
  });

export type ImageRootProps = React.HTMLAttributes<HTMLSpanElement> &
  Partial<ImageContext>;

export type ImageRootRef = React.ComponentRef<"span">;

export const Root = React.forwardRef<ImageRootRef, ImageRootProps>(
  (props, ref) => {
    const [status, setStatus] = React.useState<ImageLoadingStatus>(
      props.status ?? ImageLoadingStatus.Idle
    );

    const handleStatusVhange = React.useCallback(
      (status: ImageLoadingStatus) => {
        setStatus(status);
        props.onStatusChange?.(status);
      },
      [props]
    );

    return (
      <ImageContextProvider
        value={{ status, onStatusChange: handleStatusVhange }}>
        <span {...props} ref={ref} />
      </ImageContextProvider>
    );
  }
);

export type ImageResourceProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
};

export type ImageResourceRef = React.ComponentRef<"img">;

export const Resource = React.forwardRef<ImageResourceRef, ImageResourceProps>(
  (props, ref) => {
    const context = useImageContext();
    const loadingStatus = useImageLoadingStatus(props.src);

    const handleLoadingStatusChange = React.useEffectEvent(
      (status: ImageLoadingStatus) => {
        props.onLoadingStatusChange?.(status);
        context.onStatusChange(status);
      }
    );

    React.useLayoutEffect(() => {
      handleLoadingStatusChange(loadingStatus);
    }, [loadingStatus]);

    return (
      <React.Activity
        mode={
          loadingStatus === ImageLoadingStatus.Loaded ? "visible" : "hidden"
        }>
        <img {...props} ref={ref} />
      </React.Activity>
    );
  }
);

export type ImageFallbackProps = React.HTMLAttributes<HTMLSpanElement> & {
  delay?: number;
};

export type ImageFallbackRef = React.ComponentRef<"span">;

export const Fallback = React.forwardRef<ImageFallbackRef, ImageFallbackProps>(
  (props, ref) => {
    const context = useImageContext();
    const [isVisible, setIsVisible] = React.useState(props.delay === undefined);

    React.useEffect(() => {
      if (props.delay !== undefined) {
        const timerId = window.setTimeout(
          () => setIsVisible(true),
          props.delay
        );
        return () => window.clearTimeout(timerId);
      }
    }, [props.delay]);

    return (
      <React.Activity
        mode={
          isVisible && context.status !== ImageLoadingStatus.Loaded
            ? "visible"
            : "hidden"
        }>
        <span {...props} ref={ref} />
      </React.Activity>
    );
  }
);

export function resolveLoadingStatus(
  image: HTMLImageElement | null,
  src?: string
): ImageLoadingStatus {
  if (!image) {
    return ImageLoadingStatus.Idle;
  }
  if (!src) {
    return ImageLoadingStatus.Error;
  }
  if (image.src !== src) {
    image.src = src;
  }
  return image.complete && image.naturalWidth > 0
    ? ImageLoadingStatus.Loaded
    : ImageLoadingStatus.Loading;
}

export function useImageLoadingStatus(src: string | undefined) {
  const isHydrated = useIsHydrated();
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  const image = (() => {
    if (!isHydrated) return null;
    if (!imageRef.current) {
      imageRef.current = new window.Image();
    }
    return imageRef.current;
  })();

  const [loadingStatus, setLoadingStatus] = React.useState<ImageLoadingStatus>(
    () => resolveLoadingStatus(image, src)
  );

  React.useLayoutEffect(() => {
    setLoadingStatus(resolveLoadingStatus(image, src));
  }, [image, src]);

  React.useLayoutEffect(() => {
    const updateStatus = (status: ImageLoadingStatus) => () => {
      setLoadingStatus(status);
    };

    if (!image) return;

    const handleLoad = updateStatus(ImageLoadingStatus.Loaded);
    const handleError = updateStatus(ImageLoadingStatus.Error);
    image.addEventListener("load", handleLoad);
    image.addEventListener("error", handleError);

    return () => {
      image.removeEventListener("load", handleLoad);
      image.removeEventListener("error", handleError);
    };
  }, [image]);

  return loadingStatus;
}

export const Image = {
  Root,
  Resource,
  Fallback,
};
