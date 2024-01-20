"use client";

import {
    BubbleMenu,
    EditorContent,
    FloatingMenu,
    useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {QuestionNode} from "./editor-nodes/QuestionNode.jsx";
import React, {useEffect, useState} from "react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from "@nextui-org/react";
import {Card, CardBody} from "@nextui-org/react";
import {QuizCard} from "./editor-nodes/QuizCard.jsx";

import config from "@/config.jsx";

// enum Mode

const modes = {
    NOTETAKING: "Notetaking",
    READ_ONLY: "Read-Only",
    QUIZ_MODE: "Quiz-Mode",
}

export const Editor = ({data}) => {
    console.log("data", data)
    const {title: originalTitle, content, id} = data;
    const [title, setTitle] = useState(originalTitle);
    // get /api/notes/{activeTab}
    // fetch(`${config.API_URL}/api/notes/${activeTab}`, {
    //     method: 'GET',
    //     credentials: 'include',
    //     headers: {'Content-Type': 'application/json'},
    // }).then((response) => {
    //     return response.json()
    // }).then((data) => {
    //     console.log("GET", data)
    // }).catch((error) => {
    //     console.log(error)
    function updateNotesOnDb(editor) {
        return
        if (!editor) {
            return
        }
        fetch(`${config.API_URL}/api/notes/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: title,
                content: editor ? editor.getJSON().content : [],
            })
        }).then((response) => {
            return response.json()
        }).then((data) => {
            console.log("PUT", data)
        }).catch((error) => {
            console.log(error)
        })
    }

// })
    const editor = useEditor({
        extensions: [
            StarterKit,
            QuestionNode,
        ],
        // content: content,
        content: content ? content : [],
        // content: `
        // <h1>Title</h1>
        // <p>Theodore II Doukas Laskaris or Ducas Lascaris (Greek: Θεόδωρος Δούκας Λάσκαρις, romanized: Theodōros Doukas Laskaris; November 1221/1222 – 16 August 1258) was Emperor of Nicaea from 1254 to 1258. He was the only child of Emperor John III Doukas Vatatzes and Empress Irene Laskarina. His mother was the eldest daughter of Theodore I Laskaris, who had established the Empire of Nicaea as a successor state to the Byzantine Empire in Asia Minor after the crusaders captured the Byzantine capital, Constantinople, during the Fourth Crusade in 1204. Theodore received an excellent education from two renowned scholars, Nikephoros Blemmydes and George Akropolites. He made friends with young intellectuals, especially with a page of low birth, George Mouzalon. Theodore began to write treatises on theological, historical and philosophical themes in his youth.</p>
        // <question-node question="What is 1+2?" answer="3">
        // </question-node>
        // <br class="ProseMirror-trailingBreak">
        // `,
        onUpdate: ({editor}) => {
            // console.log(editor.getHTML());
            // console.log(editor.getJSON());
            // PUT /api/notes/{activeTab}
            updateNotesOnDb(editor);
        },
    });
    const [isEditable, setIsEditable] = useState(true);

    useEffect(() => {
        const editableEvent = new CustomEvent("editable", {detail: isEditable});
        document.dispatchEvent(editableEvent);
    });
    const [selectedText, setSelectedText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [mode, setMode] = useState(modes.NOTETAKING); // 'Notetaking' or 'Read-Only'
    useEffect(() => {
        if (editor) {
            editor.setEditable(isEditable);
        }

    }, [isEditable, editor]);

    console.log(questions);

    const generateQuestions = async (content) => {
        const body = {
            query: content,
            type: "questions",
        };
        setIsLoading(true);
        setIsEditable(false);
        const response = await fetch(`${config.API_URL}/api/generate`, {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        })
            .then((response) => response.json())
            .then((data) => {
                setIsLoading(false);
                setIsEditable(true);
                console.log(data.data);
                // TODO: add questions to editor and remove setQuestions
                setQuestions(data.data);
            });
    };

    function handleTitleChange(event) {
        setTitle(event.target.value)
        updateNotesOnDb(editor)
    }

    return (
        <section className="py-4 px-0 pr-4 min-w-7xl flex-grow">
            <Dropdown>
                <DropdownTrigger>
                    <Button variant="bordered" className="mb-2">{mode}</Button>
                </DropdownTrigger>
                <DropdownMenu
                    aria-label="Modes"
                    onAction={(key) => {
                        setMode(key);
                        setIsEditable(key === modes.NOTETAKING);
                    }}
                >
                    <DropdownItem key={modes.NOTETAKING}>{modes.NOTETAKING}</DropdownItem>
                    <DropdownItem key={modes.READ_ONLY}>{modes.READ_ONLY}</DropdownItem>
                    <DropdownItem key={modes.QUIZ_MODE}>{modes.QUIZ_MODE}</DropdownItem>
                </DropdownMenu>
            </Dropdown>

            <div>
                <h1 contentEditable={true} onChange={handleTitleChange}>{"Title"+title}</h1>
                {/* <div>
              <input type="checkbox" checked={isEditable} onChange={() => setIsEditable(!isEditable)}/>
              Editable
          </div> */}

                {editor && (
                    <BubbleMenu editor={editor} tippyOptions={{duration: 100}}>
                        {!isLoading ? (
                            <button
                                onClick={() =>
                                    generateQuestions(window.getSelection().toString())
                                }
                                className="bg-rose-500 hover:bg-rose-700 text-white px-2 py-1 rounded-md shadow"
                            >
                                Generate
                            </button>
                        ) : (
                            <Button color="primary" isLoading>
                                Loading
                            </Button>
                        )}
                    </BubbleMenu>
                )}
                {editor && (
                    <FloatingMenu editor={editor} tippyOptions={{duration: 100}}>
                        <Card className="py-1">
                            <CardBody>
                                <p className="text-xs px-2">MENU</p>
                                <button
                                    onClick={() =>
                                        editor.chain().focus().toggleHeading({level: 1}).run()
                                    }
                                    className={`${
                                        editor.isActive("heading", {level: 1})
                                            ? "is-active floating-menu-button"
                                            : "floating-menu-button"
                                    }
                                     text-left px-2 hover:brightness-75
                                    `}
                                >
                                    Heading 1
                                </button>
                                <button
                                    onClick={() =>
                                        editor.chain().focus().toggleHeading({level: 2}).run()
                                    }
                                    className={`${
                                        editor.isActive("heading", {level: 2})
                                            ? "is-active floating-menu-button"
                                            : "floating-menu-button"
                                    }
                                        text-left px-2 hover:brightness-75
                                        `}
                                >
                                    Heading 2
                                </button>
                                <button
                                    onClick={() => {
                                        editor.commands.insertContent(
                                            '<question-node question="" answer="">Hello</question-node><br class="ProseMirror-trailingBreak">'
                                        );
                                    }}
                                    className={`${
                                        editor.isActive("questionNode")
                                            ? "is-active floating-menu-button"
                                            : "floating-menu-button"
                                    }
                                    text-left px-2 hover:brightness-75
                                    `}
                                >
                                    Question
                                </button>
                                <button
                                    onClick={() =>
                                        editor.chain().focus().toggleBulletList().run()
                                    }
                                    className={`${
                                        editor.isActive("bulletList")
                                            ? "is-active floating-menu-button"
                                            : "floating-menu-button"
                                    }
                                        text-left px-2 hover:brightness-75
                                        `}
                                >
                                    Bullets
                                </button>
                            </CardBody>
                        </Card>
                    </FloatingMenu>
                )}
                {(mode === modes.QUIZ_MODE ?
                        <div>
                            {editor &&
                                editor
                                    .getJSON()
                                    .content.filter((x) => x.type === "questionNode")
                                    .map((x) => x.attrs)
                                    .map(({question, answer}, index) => (
                                        (<QuizCard key={index} question={question} expectedAnswer={answer}/>)
                                    ))}
                        </div> :
                        <EditorContent editor={editor}/>
                )}
            </div>
        </section>
    );
};
