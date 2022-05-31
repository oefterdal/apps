import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import readXlsxFile from 'read-excel-file';

export interface XlsxData {
    headers: string[];
    rows: Record<string, any>[];
}

const readXlsx = async (file: File): Promise<XlsxData> => {
    const allRows = await readXlsxFile(file);
    const headers = allRows[0].map((col) => col.toString());
    const rows = allRows.splice(1).map((row) =>
        row.reduce((record: Record<string, any>, col, i) => {
            record[headers[i]] = col;
            return record;
        }, {}),
    );

    return {
        headers,
        rows,
    };
};

interface FileChooserProps {
    onChange: (data: XlsxData) => void;
}

export const FileChooser = ({ onChange }: FileChooserProps) => {
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const extension = file.name.split('.').at(-1);
        switch (extension) {
            case 'xlsx':
                const data = await readXlsx(file);
                onChange(data);
                break;
            default:
                const reader = new FileReader();

                reader.onabort = () => console.log('file reading was aborted');
                reader.onerror = () => console.log('file reading has failed');
                reader.onload = () => {
                    // Do whatever you want with the file contents
                    const binaryStr = reader.result;
                    console.log(binaryStr);
                };
                reader.readAsArrayBuffer(file);
        }
    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
    );
};
