import React, { useEffect, useRef, useState } from 'react';

export default function EditableBox({ initialText, onSave, isEnterEable } :
    {
        initialText: string,
        onSave: (text: string) => void,
        isEnterEable: boolean,
    }) {
    const [text, setText] = useState(initialText);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        onSave(e.target.value);
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    return (
        <textarea
            className="w-full p-2 rounded border overflow-hidden"
            value={text}
            ref={textareaRef}
            wrap="soft"
            rows={1}
            onChange={handleChange}
            onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (event.key === 'Enter' && !isEnterEable) {
                    event.preventDefault();
                }
            }}
            autoFocus
        />
    );
};