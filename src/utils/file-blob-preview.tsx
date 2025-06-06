interface Props {
  fileUrl: string;
}
const FileBlobPreview = ({ fileUrl }: Props) => (
  <div>
    <iframe
      src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
      width="100%"
      height="500px"
      title="Excel Preview"
      style={{ border: 'none' }}
    />
  </div>
);

export default FileBlobPreview;
