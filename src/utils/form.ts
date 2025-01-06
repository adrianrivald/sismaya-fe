import dayjs from 'dayjs';
import type { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import type { TextFieldProps } from '@mui/material';
import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import type { FieldDropzoneProps, MultipleDropzoneFieldProps } from 'src/components/form';

export function getTextProps<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  name: Path<TFieldValues>
): Partial<TextFieldProps> {
  const error = form.formState.errors[name];

  return {
    ...form.register(name),
    error: !!error,
    helperText: error ? error?.message?.toString() : undefined,
  };
}

export function getSelectProps<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  name: Path<TFieldValues>
): Partial<TextFieldProps> {
  return {
    ...getTextProps(form, name),
    select: true,
  };
}

export function getDatePickerProps<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  name: Path<TFieldValues>
): Partial<DatePickerProps<any>> {
  return {
    value: dayjs(form.getValues(name)),
    onChange: (value) => form.setValue(name, value?.toISOString() ?? ''),
    // error: !!error,
    // helperText: error ? error?.message?.toString() : undefined,
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

export function getMultipleDropzoneProps<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  name: Path<TFieldValues>
): MultipleDropzoneFieldProps<TFieldValues> {
  return {
    name,
    control: form.control,
  };
}
