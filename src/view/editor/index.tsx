/*
 * @Author: your name
 * @Date: 2021-04-20 23:04:58
 * @LastEditTime: 2021-04-20 23:27:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dashboard_template\src\view\editor\index.tsx
 */
import React, { useCallback, useState } from 'react';
import { Editor as ReactEditor } from '@bytemd/react';
import hl from '@bytemd/plugin-highlight';
import gfm from '@bytemd/plugin-gfm';
import 'bytemd/dist/index.min.css';

const Editor: React.FC = () => {
  const [markdownSrc, setMarkdownSrc] = useState('');

  const onEditorChange = useCallback((value) => {
    setMarkdownSrc(value);
  }, []);

  return (
    <div className="container">
      <ReactEditor
        value={markdownSrc}
        onChange={onEditorChange}
        plugins={[
          hl(),
          gfm(),
        ]}
      />
    </div>
  );
};

export default Editor;
