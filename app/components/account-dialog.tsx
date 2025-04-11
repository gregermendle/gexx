import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { useFetcher } from "react-router";
import { abbrevName } from "~/lib/utils";
import { accountSchema } from "~/schemas/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface AccountDialogProps {
  children?: ReactNode;
  defaultValues: z.infer<typeof accountSchema>;
}

export function AccountDialog({ children, defaultValues }: AccountDialogProps) {
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher();

  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues,
  });

  useEffect(() => {
    if (fetcher.data?.ok) {
      form.reset();
      setOpen(false);
    }
  }, [fetcher.data]);

  function onSubmit(values: z.infer<typeof accountSchema>) {
    fetcher.submit(values, {
      action: "/api/v1/user",
      method: "PUT",
    });
  }

  const avatarUrl = `https://riptar.gregermendle.com/dither?url=https://riptar.gregermendle.com/riptar/${defaultValues.name}?format=png&height=80&width=80`;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent className="sm:max-w-[420px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>
            Update your account information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogBody className="space-y-4">
              <Avatar className="size-20 rounded-lg grayscale">
                <AvatarImage src={avatarUrl} alt={defaultValues.name} />
                <AvatarFallback className="rounded-lg">
                  {abbrevName(defaultValues.name)}
                </AvatarFallback>
              </Avatar>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="greg@gexx.ai" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogBody>

            <DialogFooter className="flex gap-2 justify-end w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={fetcher.state === "loading"}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={fetcher.state === "loading"}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
