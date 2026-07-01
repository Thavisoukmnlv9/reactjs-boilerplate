import { EyeIcon, EyeOffIcon } from 'lucide-react'
import type * as React from 'react'

import { cn } from '@/core/utils/cn'
import { buttonVariants } from './button'
import {
  InputBase,
  InputBaseAdornment,
  InputBaseControl,
  InputBaseInput,
} from './input-base'
import * as PasswordInputPrimitive from './password-input-primitive'

type PasswordInputProps = React.ComponentProps<
  typeof PasswordInputPrimitive.Root
> &
  React.ComponentProps<typeof InputBase>

function PasswordInput({
  visible,
  defaultVisible,
  onVisibleChange,
  ...props
}: PasswordInputProps) {
  return (
    <PasswordInputPrimitive.Root
      visible={visible}
      defaultVisible={defaultVisible}
      onVisibleChange={onVisibleChange}
    >
      <InputBase data-slot="password-input" {...props} />
    </PasswordInputPrimitive.Root>
  )
}

function PasswordInputAdornment(
  props: React.ComponentProps<typeof InputBaseAdornment>
) {
  return <InputBaseAdornment data-slot="password-input-adornment" {...props} />
}

function PasswordInputInput(
  props: React.ComponentProps<typeof PasswordInputPrimitive.Input>
) {
  return (
    <InputBaseControl>
      <PasswordInputPrimitive.Input
        data-slot="password-input-input"
        asChild
        {...props}
      >
        <InputBaseInput />
      </PasswordInputPrimitive.Input>
    </InputBaseControl>
  )
}

function PasswordInputAdornmentToggle({
  className,
  ...props
}: React.ComponentProps<typeof PasswordInputPrimitive.Toggle>) {
  return (
    <InputBaseAdornment>
      <PasswordInputPrimitive.Toggle
        data-slot="password-input-adornment-toggle"
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'group size-6',
          className
        )}
        {...props}
      >
        <EyeIcon className="hidden size-4 group-data-[state=visible]:block" />
        <EyeOffIcon className="block size-4 group-data-[state=visible]:hidden" />
      </PasswordInputPrimitive.Toggle>
    </InputBaseAdornment>
  )
}

export {
  PasswordInput,
  PasswordInputAdornment,
  PasswordInputAdornmentToggle,
  PasswordInputInput,
}
