import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  TextField,
  Autocomplete,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';
import { useRequestAssignees } from 'src/services/request/use-request-detail';

interface Assignees {
  id: number;
  name: string;
  avatar: string;
}

export interface AssigneeFieldProps<TFormFields extends FieldValues = FieldValues>
  extends UseControllerProps<TFormFields> {
  requestId: string | number;
  defaultAssignees?: Array<Assignees>;
}

export function AssigneeField({
  requestId,
  defaultAssignees = [],
  ...controllerProps
}: AssigneeFieldProps) {
  const { field, fieldState } = useController(controllerProps);
  const { data = [], isLoading } = useRequestAssignees(requestId.toString());
  const assignees = data as unknown as Array<Assignees>;

  return (
    <FormControl>
      <Autocomplete
        multiple
        onChange={(_, value) => field.onChange(value.map((v) => ({ id: v.id })))}
        loading={isLoading}
        options={assignees}
        disabled={isLoading}
        defaultValue={defaultAssignees}
        getOptionLabel={(option) => (typeof option === 'string' ? option : (option?.name ?? ''))}
        isOptionEqualToValue={(option, value) => option?.name === value?.name}
        renderTags={(value, getTagProps) =>
          value.map((option, index: number) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                variant="outlined"
                avatar={<Avatar alt="Natacha" src={option.avatar} />}
                label={option.name}
                key={key}
                {...tagProps}
              />
            );
          })
        }
        renderOption={(props, option) => (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            <img loading="lazy" width="20" src={option.avatar} alt={option.name} />
            {option.name}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            error={!!fieldState.error}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            label="Assignee"
          />
        )}
      />

      {fieldState.error ? (
        <FormHelperText sx={{ color: 'error.main' }}>{fieldState.error.message}</FormHelperText>
      ) : null}
    </FormControl>
  );
}
