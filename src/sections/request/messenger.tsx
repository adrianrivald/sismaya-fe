import * as React from 'react';
import {
  Box,
  Input,
  Typography,
  CircularProgress as Loader,
  Avatar,
  TextField,
} from '@mui/material';
import { SvgColor } from 'src/components/svg-color';
import { Form } from 'src/components/form/form';
import { useMessagePost } from 'src/services/messaging/use-messaging';
import type { Messaging } from 'src/services/messaging/types';
import { Bounce, toast } from 'react-toastify';
import dayjs from 'dayjs';
import ModalDialog from 'src/components/modal/modal';
import { truncate } from 'src/utils/truncate-text';
import { useAuth } from '../auth/providers/auth';

const Messenger = React.lazy(() => import('./task/task-activities'));

interface RequestChatProps {
  chats: Messaging[];
  request_id: number;
  onSuccess: (newData: any) => void;
  isFetchingChat: boolean;
}

function RequestChat({ chats, request_id, onSuccess, isFetchingChat }: RequestChatProps) {
  const [inputContent, setInputContent] = React.useState('');
  const { user } = useAuth();
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState('');
  const [isPreviewImage, setIsPreviewImage] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState('');
  // const chatRef = React.useRef<HTMLDivElement | null>(null);
  const { mutate: sendChat } = useMessagePost(onSuccess);

  React.useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    const element = document.getElementById('bottomChatBox');

    if (element) {
      element.scrollIntoView({
        block: 'end',
      });
    }
  };

  const onPreviewImage = (selectedImageSrc: string) => {
    setSelectedImage(selectedImageSrc);
    setIsPreviewImage(true);
  };

  const onResetField = () => {
    setInputContent('');
    setPreview('');
    setFile(null);
  };
  const handleSubmit = () => {
    if (inputContent !== '' || preview !== '') {
      try {
        sendChat({
          content: inputContent,
          request_id,
          file,
        });
        onResetField();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputContent(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const size = e.target.files[0]?.size;

      if (size > 5000000) {
        const reason = `File is larger than ${Math.round(5000000 / 1000000)} mb`;
        toast.error(reason, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        });
      } else if (e.target.files) {
        setFile(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
      }
    }
  };

  const onRemoveFile = () => {
    setFile(null);
    setPreview('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevents newline in textarea
      handleSubmit();
    }
  };

  return (
    <>
      <Box
        id="chatBox"
        display="flex"
        flexDirection="column"
        gap={4}
        overflow="auto"
        height={400}
        sx={{ p: 2 }}
      >
        {isFetchingChat && (
          <Box display="flex" justifyContent="center">
            <Loader />
          </Box>
        )}
        {chats?.length > 0 ? (
          <>
            {chats
              ?.map((chat) => {
                const isMine = chat?.creator?.user_id !== user?.user_info?.user_id;
                return (
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={1}
                    alignItems={!isMine ? 'flex-end' : 'flex-start'}
                  >
                    <Box display="flex" gap={1}>
                      {isMine && (
                        <Avatar
                          sx={{ width: 32, height: 32 }}
                          src={chat?.creator?.profile_picture}
                        />
                      )}
                      <Box
                        display="flex"
                        flexDirection="column"
                        gap={1}
                        alignItems={!isMine ? 'flex-end' : 'flex-start'}
                      >
                        <Box display="flex" gap={2}>
                          <Typography color="grey.600" fontSize={12}>
                            {truncate(chat?.creator?.name, 15)} <strong>·</strong>{' '}
                            {chat?.creator?.role?.name ?? 'Role'} <strong>·</strong>{' '}
                            {dayjs(chat?.created_at).format('h:mm a')}
                          </Typography>
                          {/* <Typography color="grey.600" fontSize={12}>
                            {dayjs(chat?.created_at).format('h:mm a')}
                          </Typography> */}
                        </Box>

                        {chat?.content !== '' && (
                          <Box
                            sx={{
                              backgroundColor: !isMine ? '#CCDEE5' : 'grey.200',
                              borderRadius: '8px',
                              padding: 2,
                            }}
                          >
                            {chat?.content} <br />
                          </Box>
                        )}
                        {chat?.file_path && (
                          <Box
                            sx={{
                              maxWidth: '75%',
                            }}
                          >
                            <ModalDialog
                              onClose={() => {
                                setIsPreviewImage(false);
                                setSelectedImage('');
                              }}
                              open={isPreviewImage}
                              setOpen={setIsPreviewImage}
                              minWidth={600}
                              title="Preview"
                              content={
                                (
                                  <Box
                                    component="img"
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      mt: 4,
                                      maxHeight: '500px',
                                      mx: 'auto',
                                    }}
                                    src={`${chat?.file_path}/${chat?.file_name}`}
                                  />
                                ) as JSX.Element & string
                              }
                            >
                              <Box
                                sx={{
                                  borderRadius: '8px',
                                  maxWidth: '100%',
                                  cursor: 'pointer',
                                }}
                                component="img"
                                src={`${chat?.file_path}/${chat?.file_name}`}
                                onClick={() =>
                                  onPreviewImage(`${chat?.file_path}/${chat?.file_name}`)
                                }
                              />
                            </ModalDialog>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })
              .reverse()}
            <Box id="bottomChatBox" />
          </>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
            justifyContent="center"
            alignItems="center"
            height="100%"
            color="grey.500"
          >
            <Box component="img" src="/assets/icons/chat.png" />
            <Typography fontWeight="bold">Start a conversation</Typography>
            <Typography fontSize={12}>Write something...</Typography>
          </Box>
        )}
      </Box>
      <Form onSubmit={handleSubmit}>
        {() => (
          <Box
            sx={{
              borderTop: 1,
              borderColor: 'grey.300',
            }}
            display="flex"
            alignItems="center"
            gap={1}
            justifyContent="space-between"
          >
            <Box display="flex" flexDirection="column" gap={1} py={2}>
              <TextField
                InputProps={{
                  disableUnderline: true,
                }}
                variant="standard"
                multiline
                autoComplete="off"
                type="text"
                value={inputContent}
                id="content"
                onChange={onChangeContent}
                sx={{ borderWidth: 0 }}
                onKeyDown={handleKeyDown}
              />
              <Box position="relative" sx={{ width: '50%' }}>
                <ModalDialog
                  onClose={() => {
                    setIsPreviewImage(false);
                    setSelectedImage('');
                  }}
                  open={isPreviewImage}
                  setOpen={setIsPreviewImage}
                  minWidth={600}
                  title="Preview"
                  content={
                    (
                      <Box
                        component="img"
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          mt: 4,
                          maxHeight: '500px',
                          mx: 'auto',
                        }}
                        src={selectedImage}
                      />
                    ) as JSX.Element & string
                  }
                >
                  <Box
                    onClick={() => onPreviewImage(preview)}
                    component="img"
                    src={preview}
                    sx={{ width: '100%', cursor: 'pointer' }}
                    // onClick={onRemoveFile}
                  />
                </ModalDialog>
                {preview && (
                  <Box
                    sx={{ cursor: 'pointer', position: 'absolute', top: '-14px', right: '-6px' }}
                    onClick={onRemoveFile}
                  >
                    <SvgColor sx={{ width: 10, height: 10 }} src="/assets/icons/ic-cross.svg" />
                  </Box>
                )}
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Box>
                  <Input
                    onChange={handleFileChange}
                    type="file"
                    sx={{ display: 'none' }}
                    hidden
                    id="uploadPic"
                  />
                  <Typography component="label" htmlFor="uploadPic" sx={{ cursor: 'pointer' }}>
                    <SvgColor mt={0.5} width={18} height={18} src="/assets/icons/ic-image.svg" />
                  </Typography>
                </Box>
                {/* <SvgColor width={18} height={18} src="/assets/icons/ic-clip.svg" />
              <SvgColor width={18} height={18} src="/assets/icons/ic-mic.svg" /> */}
              </Box>
              <Box
                component="button"
                p={2}
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  border: 0,
                  borderLeft: 1,
                  borderColor: 'grey.300',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <SvgColor width={24} height={24} src="/assets/icons/ic-send.svg" />
              </Box>
            </Box>
          </Box>
        )}
      </Form>
    </>
  );
}

export function RequestMessenger({
  requestId,
  chats,
  onSuccess,
  isFetchingChat,
}: {
  requestId: number;
  chats: Messaging[];
  onSuccess: (newData: any) => void;
  isFetchingChat: boolean;
}) {
  const isTask = window.location.pathname.includes('/task');

  if (isTask) {
    return (
      <React.Suspense fallback={<Loader />}>
        <Messenger requestId={requestId}>
          <RequestChat
            isFetchingChat={isFetchingChat}
            onSuccess={onSuccess}
            request_id={requestId}
            chats={chats}
          />
        </Messenger>
      </React.Suspense>
    );
  }

  return (
    <React.Suspense fallback={<Loader />}>
      <Box sx={{ border: 1, borderRadius: 3, borderColor: 'grey.300' }}>
        <Box
          p={2}
          sx={{
            borderBottom: 1,
            borderColor: 'grey.300',
          }}
        >
          <Typography>Chat with Sismedika</Typography>
        </Box>
        <RequestChat
          isFetchingChat={isFetchingChat}
          onSuccess={onSuccess}
          request_id={requestId}
          chats={chats}
        />
      </Box>
    </React.Suspense>
  );
}
