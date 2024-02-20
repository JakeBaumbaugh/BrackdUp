import { ChangeEvent, useMemo } from "react";
import { Button } from "react-bootstrap";
import "./file-upload.css";

const FILE_LIMIT = 8 * 1024 * 1024;

interface FileUploadProps {
    file?: File;
    setFile: (file?: File) => void;
}

export default function FileUpload({file, setFile}: FileUploadProps) {
    const fileUrl = useMemo(() => file ? URL.createObjectURL(file) : undefined, [file]);
    console.log("background image", file);

    const onUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.size > FILE_LIMIT) {
                alert("File too big, must be below 8MB.");
            } else {
                setFile(files[0]);
            }
        }
    };

    return (
        <div className="file-upload">
            <div className="file-details">
                <Button as="label">
                    <input
                        type="file"
                        accept="image/*"
                        name="background-image"
                        onChange={onUpload}
                    />
                    <p>Browse...</p>
                </Button>
                <p>{file ? file.name : "No file selected."}</p>
            </div>
            {fileUrl && <img src={fileUrl} alt="Tournament background"/>}
        </div>
    );
}