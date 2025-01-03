import type { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import type { TextFieldProps } from '@mui/material';
import type { FieldDropzoneProps } from 'src/components/form';

export function getFieldProps<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  name: Path<TFieldValues>
): Partial<TextFieldProps> {
  const error = form.formState.errors[name];

  return {
    ...form.register(name),
    defaultValue: form.getValues(name),
    error: !!error,
    helperText: error ? error?.message?.toString() : undefined,
  };
}

export function getDropzoneProps<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  name: Path<TFieldValues>
): FieldDropzoneProps<TFieldValues> {
  const error = form.formState.errors[name];

  return {
    controller: {
      name,
      control: form.control,
    },
    error,
    helperText: error ? error?.message?.toString() : undefined,
  };
}
