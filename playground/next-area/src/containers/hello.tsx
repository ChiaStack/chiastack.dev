"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { X_CAPTCHA_RESPONSE } from "@chiastack/services/captcha";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { env } from "@/env";

const schema = z.object({
  name: z.string().min(1),
  captcha: z.string().min(1),
});

export function Hello() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof schema>) => {
      return ky
        .post("/api/hello", {
          json: data,
          headers: {
            [X_CAPTCHA_RESPONSE]: data.captcha,
          },
        })
        .json<{ message: string }>();
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>What is your name?</FieldLegend>
            <FieldDescription>Enter your name</FieldDescription>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      placeholder="John Doe"
                      required
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="captcha"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Turnstile
                      options={{
                        theme: "light",
                      }}
                      siteKey={env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
                      onSuccess={(data) => {
                        field.onChange(data);
                      }}
                      tw=""
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit" disabled={mutation.isPending}>
              Submit
            </Button>
            <Button
              variant="outline"
              type="button"
              disabled={mutation.isPending}>
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
