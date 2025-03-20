import React from 'react';

interface Props {
  fileUrl: string;
}
const FilePreview = ({ fileUrl }: Props) => {
  const officeOnlineUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;

  return (
    <div>
      <iframe
        src={officeOnlineUrl}
        width="100%"
        height="500px"
        title="Excel Preview"
        style={{ border: 'none' }}
      />
    </div>
  );
};

export default FilePreview;
