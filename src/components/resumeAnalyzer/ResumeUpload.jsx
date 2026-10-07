import { useRef, useState } from "react"
import {
    FiFileText,
    FiUploadCloud,
    FiX
} from "react-icons/fi"

const ResumeUpload = ({
    onFileSelect,
    selectedFile,
    uploading = false
}) => {
    const inputRef = useRef(null)

    const [dragging, setDragging] =
        useState(false)

    const handleFile = (file) => {
        if (!file || uploading) return

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]

        const allowedExtensions = [
            ".pdf",
            ".docx"
        ]

        const extension =
            "." +
            file.name
                .split(".")
                .pop()
                .toLowerCase()

        if (
            !allowedTypes.includes(file.type) ||
            !allowedExtensions.includes(extension)
        ) {
            alert(
                "Please upload a PDF or DOCX resume."
            )

            return
        }

        if (
            file.size >
            10 * 1024 * 1024
        ) {
            alert(
                "Resume size should be less than 10MB."
            )

            return
        }

        onFileSelect(file)
    }


    const handleInputChange = (event) => {
        const file =
            event.target.files?.[0]

        handleFile(file)
    }


    const handleDrop = (event) => {
        event.preventDefault()

        setDragging(false)

        const file =
            event.dataTransfer.files?.[0]

        handleFile(file)
    }


    const removeFile = () => {
        if (uploading) return

        onFileSelect(null)

        if (inputRef.current) {
            inputRef.current.value = ""
        }
    }


    return (
        <div className="w-full">

            {!selectedFile ? (
                <div
                    onDragOver={(event) => {
                        event.preventDefault()
                        setDragging(true)
                    }}

                    onDragLeave={() =>
                        setDragging(false)
                    }

                    onDrop={handleDrop}

                    onClick={() =>
                        inputRef.current?.click()
                    }

                    className={`
                        group cursor-pointer
                        rounded-2xl border-2 border-dashed
                        p-8 text-center
                        transition-all duration-200
                        ${
                            dragging
                                ? "border-black bg-gray-50"
                                : "border-gray-200 hover:border-gray-400 hover:bg-gray-50/70"
                        }
                    `}
                >

                    <input
                        ref={inputRef}
                        type="file"
                        accept=".pdf,.docx"
                        onChange={
                            handleInputChange
                        }
                        className="hidden"
                        disabled={uploading}
                    />

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
                        <FiUploadCloud
                            size={24}
                        />
                    </div>

                    <h3 className="text-base font-semibold text-black">
                        Upload your resume
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                        Drag & drop your resume
                        here or click to browse
                    </p>

                    <p className="mt-3 text-xs text-gray-400">
                        PDF or DOCX · Maximum 10MB
                    </p>

                </div>
            ) : (

                <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

                    <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                            <FiFileText
                                size={20}
                            />
                        </div>

                        <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-black">
                                {selectedFile.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                {(
                                    selectedFile.size /
                                    (1024 * 1024)
                                ).toFixed(2)}{" "}
                                MB
                            </p>

                            {uploading && (
                                <p className="mt-1 text-xs font-medium text-black">
                                    Processing resume...
                                </p>
                            )}

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={removeFile}
                        disabled={uploading}
                        className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <FiX size={18} />
                    </button>

                </div>
            )}

        </div>
    )
}

export default ResumeUpload