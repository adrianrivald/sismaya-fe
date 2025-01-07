import { Box, Stack, Typography, ButtonBase, Button } from '@mui/material';
import * as Dialog from 'src/components/disclosure/modal';
import { Iconify } from 'src/components/iconify';
import { downloadFile } from 'src/utils/download';
import { type Task } from 'src/services/request/task';

function AttachmentItem({
  file,
  variant = 'list',
}: {
  file: Task['files'][number];
  variant?: 'list' | 'modal';
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      border="1px solid rgba(145, 158, 171, 0.32)"
      borderRadius={1}
      width={variant === 'list' ? '35%' : 'auto'}
      spacing={1}
      px={1.5}
      py={0.5}
      title={`download ${file.name}`}
      sx={{ cursor: 'pointer' }}
      onClick={(event) => {
        event.stopPropagation();
        downloadFile(file.url);
      }}
    >
      <Iconify icon="solar:document-outline" />
      <Typography
        fontWeight={600}
        fontSize={12}
        lineHeight="22px"
        flexGrow={1}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {file.name}
      </Typography>
      <Iconify icon="solar:download-minimalistic-outline" />
    </Stack>
  );
}

export function TaskAttachment({ files }: Pick<Task, 'files'>) {
  if (!files || files.length < 1) {
    return null;
  }

  return (
    <>
      <AttachmentItem file={files?.[0]} />

      {files.length > 1 ? (
        <Dialog.Root>
          {({ onOpen, onClose }) => (
            <>
              <ButtonBase
                sx={{
                  border: '1px solid rgba(145, 158, 171, 0.32)',
                  borderRadius: 999,
                  padding: 1,
                  marginLeft: 1,
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  onOpen();
                }}
              >
                +{files.length - 1}
              </ButtonBase>

              <Dialog.Content>
                <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
                  <Typography fontWeight={600} fontSize={14} lineHeight="22px">
                    Attachments
                  </Typography>
                </Box>

                <Stack spacing={2} flexGrow={1} p={2}>
                  {files.map((file) => (
                    <AttachmentItem key={file.url} file={file} variant="modal" />
                  ))}
                </Stack>

                <Box p={2} display="flex" justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={(event) => {
                      event.stopPropagation();
                      onClose();
                    }}
                  >
                    Close
                  </Button>
                </Box>
              </Dialog.Content>
            </>
          )}
        </Dialog.Root>
      ) : null}
    </>
  );
}
