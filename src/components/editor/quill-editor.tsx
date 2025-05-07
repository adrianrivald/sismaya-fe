/* eslint-disable */

import { Box } from '@mui/material';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { styled } from '@mui/material/styles';
import { useCallback, useRef } from 'react';
import { Controller } from 'react-hook-form';

// ----------------------------------------------------------------------

const StyledEditor = styled(Box)(({ theme }) => ({
  '& .ql-container': {
    // border: 'none',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    ...theme.typography.body1,
    fontFamily: theme.typography.fontFamily,
  },
  '& .ql-editor': {
    minHeight: 200,
    maxHeight: 640,
    backgroundColor: 'rgba(243, 244, 246, 0.9)',
    '&.ql-blank::before': {
      fontStyle: 'normal',
      color: theme.palette.text.disabled,
    },
    '& pre.ql-syntax': {
      ...theme.typography.body2,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[900],
    },
  },
  '& .ql-toolbar': {
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    borderBottom: `solid 1px ${theme.palette.divider}`,
    '& .ql-picker-label': {
      ...theme.typography.body1,
      color: theme.palette.text.primary,
    },
    '& .ql-stroke': {
      stroke: theme.palette.text.primary,
    },
    '& .ql-fill': {
      fill: theme.palette.text.primary,
    },
    '& button:hover, & button.ql-active': {
      '& .ql-stroke': {
        stroke: theme.palette.primary.main,
      },
      '& .ql-fill': {
        fill: theme.palette.primary.main,
      },
    },
  },
}));

// ----------------------------------------------------------------------

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link', 'image'],
  ['undo', 'redo'],
];

// Add sizes to whitelist and register them
const Size = Quill.import('formats/size');
Size.whitelist = ['small', 'medium', 'large'];
Quill.register(Size, true);

// Add fonts to whitelist and register them
const Font = Quill.import('formats/font');
Font.whitelist = ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'lucida'];
Quill.register(Font, true);

// Modules object for setting up the Quill editor
export const modules = {
  toolbar: {
    container: TOOLBAR_OPTIONS,
    handlers: {
      undo: function () {
        // @ts-ignore
        // eslint-disable-next-line prefer-destructuring, object-shorthand
        const quill = this.quill;
        quill.history.undo();
      },
      redo: function () {
        // @ts-ignore

        const quill = this.quill;
        quill.history.redo();
      },
    },
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true,
  },
};

// ----------------------------------------------------------------------

type Props = {
  name: string;
  id?: string;
  error?: boolean;
  simple?: boolean;
  helperText?: React.ReactNode;
  control?: any;
};

export default function QuillEditor({
  name,
  id,
  error,
  simple = false,
  helperText,
  control,
  ...other
}: Props) {
  const quillRef = useRef<ReactQuill>(null);

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          const mockUploadResponse = {
            url: URL.createObjectURL(file),
          };

          const quill = quillRef.current?.getEditor();
          const range = quill?.getSelection();

          if (quill && range) {
            quill.insertEmbed(range.index, 'image', mockUploadResponse.url);
          }
        } catch (err) {
          console.error('Error uploading image:', err);
        }
      }
    };
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <StyledEditor
          sx={{
            ...(error && {
              border: (theme) => `solid 1px ${theme.palette.error.main}`,
            }),
          }}
        >
          <ReactQuill
            ref={quillRef}
            value={field.value}
            onChange={field.onChange}
            modules={modules}
            formats={[
              'header',
              'font',
              'size',
              'bold',
              'italic',
              'underline',
              'align',
              'list',
              'bullet',
              'link',
              'image',
              'undo',
              'redo',
            ]}
            placeholder="Write something awesome..."
            {...other}
          />

          {helperText && helperText}
        </StyledEditor>
      )}
    />
  );
}
