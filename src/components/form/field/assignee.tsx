import { useState } from 'react';
import {
  Box,
  Stack,
  FormControl,
  FormHelperText,
  TextField,
  InputAdornment,
  CircularProgress as Loader,
  AvatarGroup,
  Avatar,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import * as Modal from 'src/components/disclosure/modal';
import {
  useController,
  useFieldArray,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form';
import { useRequestAssignees } from 'src/services/request/use-request-detail';

export interface Assignee {
  id: number;
  userId: number;
  name: string;
  email?: string;
  avatar: string;
  assigneeId?: number;
  roleName?: string;
}

export function AssigneeList({
  assignees,
  onClick,
}: {
  assignees: Array<Assignee>;
  onClick?: any;
}) {
  if (!assignees || assignees.length < 1) {
    return null;
  }

  return (
    <AvatarGroup
      max={4}
      total={assignees.length}
      onClick={() => {
        onClick();
      }}
      sx={{ cursor: 'pointer' }}
    >
      {assignees.map((assignee) => (
        <Avatar key={assignee.id} title={assignee.name} alt={assignee.name} src={assignee.avatar} />
      ))}
    </AvatarGroup>
  );
}

export interface AssigneeChooserProps {
  requestId: string | number;
  isCreate?: boolean;
  productId?: string;
  internalId?: string;
  assignees?: Array<Assignee>;
  onAssign: (assignee: Assignee, index: number) => void;
  onUnassign: (assignee: Assignee, index: number) => void;
}

export function AssigneeChooser({
  isCreate,
  requestId,
  assignees = [],
  onAssign,
  onUnassign,
  productId,
  internalId,
}: AssigneeChooserProps) {
  const [search, setSearch] = useState('');

  const { data = [], isLoading } = useRequestAssignees(productId || '', internalId || '');
  const items = (data as unknown as Array<Assignee>).filter((assignee) =>
    assignee.name.includes(search)
  );

  return (
    <Modal.Root>
      <Modal.OpenButton>
        <IconButton aria-label="Assignee" sx={{ border: '1px dashed rgba(145, 158, 171, 0.24)' }}>
          <Iconify icon="mdi:plus" />
        </IconButton>
      </Modal.OpenButton>

      <Modal.Content fullWidth maxWidth="sm">
        <Box px={2} py={2} borderBottom="1px solid rgba(145, 158, 171, 0.24)">
          <Typography variant="h6">Assignee</Typography>
        </Box>

        <Stack px={2} py={2} spacing={1}>
          <TextField
            fullWidth
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:magnifer-linear" />
                </InputAdornment>
              ),
            }}
          />

          {isLoading ? (
            <Box display="flex" justifyContent="center" p={2} aria-label="Loading assignees">
              <Loader />
            </Box>
          ) : (
            <Stack component="ul" spacing={2}>
              {items.map((assignee, index) => {
                const isAssigned = !!assignees.find((a) => a.userId === assignee.userId);

                return (
                  <Stack
                    component="li"
                    key={assignee.userId}
                    direction="row"
                    alignItems="center"
                    gap={2}
                  >
                    <Stack flexGrow={1} direction="row" alignItems="center" gap={2}>
                      <Avatar src={assignee.avatar} />

                      <Stack>
                        <Typography variant="subtitle2" color="#1C252E">
                          {assignee.name}
                        </Typography>
                        <Typography variant="body2" color="#637381">
                          {assignee.email}
                        </Typography>
                        <Typography variant="body2" color="#637381">
                          {assignee.roleName}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Button
                      size="large"
                      startIcon={
                        isAssigned ? <Iconify icon="mdi:check" /> : <Iconify icon="mdi:plus" />
                      }
                      sx={{ fontWeight: 'bold', color: isAssigned ? 'primary' : 'inherit' }}
                      onClick={() => {
                        const handler = isAssigned ? onUnassign : onAssign;

                        handler(assignee, index);
                      }}
                    >
                      {isAssigned ? 'Assigned' : 'Assign'}
                    </Button>
                  </Stack>
                );
              })}
            </Stack>
          )}
        </Stack>

        <Box
          px={2}
          py={2}
          borderTop="1px solid rgba(145, 158, 171, 0.24)"
          display="flex"
          justifyContent="flex-end"
        >
          <Modal.DismissButton>
            <Button variant="outlined">Close</Button>
          </Modal.DismissButton>
        </Box>
      </Modal.Content>
    </Modal.Root>
  );
}

export interface AssigneeChooserFieldProps<TFormFields extends FieldValues = FieldValues>
  extends UseControllerProps<TFormFields>,
    Partial<AssigneeChooserProps> {}

export function AssigneeChooserField({
  productId,
  internalId,
  isCreate,
  requestId = 0,
  assignees: defaultAssignees = [],
  onAssign,
  onUnassign,
  ...controllerProps
}: AssigneeChooserFieldProps) {
  const { fieldState } = useController(controllerProps);
  const { fields, append, remove } = useFieldArray({
    name: controllerProps.name,
    control: controllerProps.control,
    keyName: '_id',
  });
  const assignees = fields as unknown as Array<Assignee>;

  return (
    <FormControl>
      <Stack direction="row" spacing={1}>
        <AssigneeList assignees={assignees} />
        <Box flexGrow={1}>
          <AssigneeChooser
            productId={productId}
            requestId={requestId}
            internalId={internalId}
            assignees={assignees}
            onAssign={(assignee, index) => {
              append(assignee);
              if (!isCreate) {
                onAssign?.(assignee, index);
              }
            }}
            onUnassign={(assignee, index) => {
              remove(index);
              if (!isCreate) {
                onUnassign?.(assignee, index);
              }
            }}
          />
        </Box>
      </Stack>

      {fieldState.error ? (
        <FormHelperText sx={{ color: 'error.main' }}>{fieldState.error.message}</FormHelperText>
      ) : null}
    </FormControl>
  );
}
