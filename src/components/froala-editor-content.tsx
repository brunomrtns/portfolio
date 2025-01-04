import React from "react";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/fullscreen.min.js";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/font_family.min.js";
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/js/plugins/align.min.js";
import "froala-editor/js/plugins/lists.min.js";
import "froala-editor/js/plugins/link.min.js";
import "froala-editor/js/plugins/paragraph_format.min.js";
import "froala-editor/js/plugins/paragraph_style.min.js";
import "froala-editor/js/plugins/line_breaker.min.js";
import "froala-editor/js/plugins/code_view.min.js";
import "froala-editor/js/plugins/quote.min.js";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from '../config';

interface FroalaEditorComponentProps {
	model: string;
	onModelChange: (content: string) => void;
}

const FroalaEditorComponent: React.FC<FroalaEditorComponentProps> = ({
	model,
	onModelChange,
}) => {
	const { t, i18n } = useTranslation();
	const token = useSelector((state: RootState) => state.auth.token);

	const getLanguage = () => (i18n.language === "pt" ? "pt" : "en");

	const config = {
		language: getLanguage(),
		imageUploadURL: `${API_BASE_URL}/upload`,
		imageUploadParams: { id: "my_editor" },
		imageUploadMethod: "POST",
		imageMaxSize: 5 * 1024 * 1024,
		imageAllowedTypes: ["jpeg", "jpg", "png"],
		toolbarButtons: [
			"bold",
			"italic",
			"underline",
			"strikeThrough",
			"fontFamily",
			"fontSize",
			"color",
			"emoticons",
			"align",
			"formatOL",
			"formatUL",
			"outdent",
			"indent",
			"insertLink",
			"insertImage",
			"insertVideo",
			"insertFile",
			"insertTable",
			"html",
			"undo",
			"redo",
			"fullscreen",
			"paragraphFormat",
			"paragraphStyle",
			"quote",
			"codeView",
		],
		pluginsEnabled: [
			"align",
			"charCounter",
			"codeBeautifier",
			"codeView",
			"colors",
			"draggable",
			"emoticons",
			"entities",
			"file",
			"fontFamily",
			"fontSize",
			"fullscreen",
			"image",
			"imageManager",
			"inlineStyle",
			"lineBreaker",
			"link",
			"lists",
			"paragraphFormat",
			"paragraphStyle",
			"quickInsert",
			"quote",
			"table",
			"url",
			"video",
			"wordPaste",
		],
		events: {
			"image.beforeUpload": function (images: File[]) {
				const editor = this as any;
				const formData = new FormData();
				formData.append("file", images[0]);

				axios
					.post(`${API_BASE_URL}/upload`, formData, {
						headers: {
							"Content-Type": "multipart/form-data",
							Authorization: `Bearer ${token}`,
						},
					})
					.then((response) => {
						const imageUrl = response.data.location || response.data.link;
						if (imageUrl) {
							if (editor.image) {
								editor.image.insert(imageUrl, true);
							}
						} else {
							console.error("Invalid response format:", response.data);
						}
					})
					.catch((error) => {
						console.error("Error uploading image:", error);
					});

				return false;
			},
		},
	};

	return (
		<FroalaEditor
			tag="textarea"
			model={model}
			onModelChange={onModelChange}
			config={config}
		/>
	);
};

export default FroalaEditorComponent;
