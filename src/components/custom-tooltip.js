import Quill from "quill";

const Tooltip = Quill.import("ui/tooltip");
const Delta = Quill.import("delta");

class CustomTooltip extends Tooltip {
  constructor(quill, options) {
    super(quill, options);

    this.options = options;

    this.container.classList.add("ql-tooltip-custom");
    if (options.containerClass) {
      this.container.classList.add(options.containerClass);
    }

    this.container.innerHTML = this._buildTemplate();

    this.textbox = this.container.querySelector("input.ql-tooltip-value");
    this.action = this.container.querySelector(".ql-tooltip-action");

    if (options.defaultValue) {
      this.textbox.value = options.defaultValue;
    }

    this._bindEvents();
  }

  _buildTemplate() {
    const {
      inputLabel,
      inputLabelClass,
      inputPlaceholder,
      inputClass,
      actionText,
      actionClass,
    } = this.options;
    return `
      <span class="ql-tooltip-label ${inputLabelClass || ""}">${inputLabel || ""}</span>
      <input type="text" class="ql-tooltip-value ${inputClass || ""}" placeholder="${inputPlaceholder || ""}">
      <span class="ql-tooltip-action ${actionClass || ""}">${actionText || "Insert"}</span>
    `;
  }

  _bindEvents() {
    this.quill.root.addEventListener("focus", this.hide.bind(this));
    this.quill.root.addEventListener("mousedown", this.hide.bind(this));
    this.quill.on("editor-change", this._handleChange.bind(this));
    this.action.addEventListener("click", this._handleAction.bind(this));
  }

  _handleChange(eventName, ...args) {
    if (this.options.hideOnTyping && eventName === "text-change") {
      this.hide();
    }
  }

  _handleAction() {
    if (this.options.onAction) {
      this.options.onAction(this.textbox.value);
    } else {
      this._insertImage(this.textbox.value);
    }
    if (this.options.hideOnAction) {
      this.hide();
    }
    if (this.options.clearAfterHide) {
      this.textbox.value = "";
    }
  }

  _insertImage(url) {
    const range = this.quill.getSelection(true);
    this.quill.updateContents(
      new Delta()
        .retain(range.index)
        .delete(range.length)
        .insert({ image: url }),
      Quill.sources.USER
    );
    this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
    this.hide();
  }

  show() {
    super.show();
    if (this.options.onShow) {
      this.options.onShow();
    }
    this.textbox.focus();
  }

  hide() {
    super.hide();
    if (this.options.onHide) {
      this.options.onHide();
    }
  }
}

Quill.register("modules/customTooltip", CustomTooltip);

export default CustomTooltip;
