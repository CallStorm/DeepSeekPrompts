// Function to find the target element using XPath
function findTargetButton() {
    const xpath = "//div[@role='button'][.//span[text()='联网搜索']]";
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue;
}

// --- Data & Configuration ---
const PREMADE_ICONS = ['📝', '💻', '🎨', '📊', '🌐', '😂', '🎓', '🏥', '⚙️', '🚀', '💡', '🔍'];

const PREMADE_DATA = [
    {
        id: 'coding',
        name: '编程辅助',
        icon: '💻',
        is_custom: false,
        prompts: [
            { title: '代码解释', content: '请详细解释以下代码的功能和逻辑，包括输入输出和关键算法：\n' },
            { title: '代码优化', content: '请优化以下代码，使其运行更高效、更简洁，并解释优化的理由：\n' },
            { title: '写单元测试', content: '请为以下代码编写全面的单元测试，覆盖主要逻辑和边界情况：\n' },
            { title: '查找Bug', content: '这段代码运行报错或结果不符合预期，请帮我找出Bug并修复：\n' },
            { title: '代码转换', content: '请将以下代码从 [原语言] 转换为 [目标语言]：\n' }
        ]
    },
    {
        id: 'writing',
        name: '写作助手',
        icon: '📝',
        is_custom: false,
        prompts: [
            { title: '润色文章', content: '请润色以下文章，使其表达更流畅、专业，并纠正语法错误：\n' },
            { title: '写周报', content: '请根据以下工作内容生成一份周报，包含本周工作、下周计划和问题反馈：\n' },
            { title: '扩写内容', content: '请根据以下大纲或简短描述，扩写成一篇完整的文章：\n' },
            { title: '标题生成', content: '请为这篇文章生成5个吸引人的标题：\n' }
        ]
    },
    {
        id: 'creative',
        name: '创意生成',
        icon: '💡',
        is_custom: false,
        prompts: [
            { title: '头脑风暴', content: '请针对 [主题] 进行头脑风暴，列出10个创意点子：\n' },
            { title: '故事创作', content: '请以 [关键词] 为核心，写一个跌宕起伏的短篇故事：\n' },
            { title: 'Slogan设计', content: '请为这个产品设计一句朗朗上口的Slogan：\n' }
        ]
    }
];

// --- Styles ---
function injectStyles() {
    if (document.getElementById('ds-prompt-styles')) return;

    const style = document.createElement('style');
    style.id = 'ds-prompt-styles';
    style.textContent = `
        .ds-prompt-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: system-ui, -apple-system, sans-serif;
        }
        .ds-prompt-modal {
            width: 800px;
            height: 600px;
            background: #fff;
            border-radius: 12px;
            display: flex;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            position: relative;
        }
        .ds-dark .ds-prompt-modal {
            background: #2d2d2d;
            color: #fff;
        }
        .ds-prompt-sidebar {
            width: 200px;
            background: #f5f5f5;
            border-right: 1px solid #e0e0e0;
            display: flex;
            flex-direction: column;
        }
        .ds-dark .ds-prompt-sidebar {
            background: #1e1e1e;
            border-color: #333;
        }
        .ds-prompt-sidebar-header {
            padding: 16px;
            font-weight: bold;
            font-size: 16px;
            border-bottom: 1px solid #e0e0e0;
        }
        .ds-dark .ds-prompt-sidebar-header {
            border-color: #333;
        }
        .ds-prompt-categories {
            flex: 1;
            overflow-y: auto;
            padding: 8px;
        }
        .ds-prompt-category-item {
            padding: 10px 12px;
            cursor: pointer;
            border-radius: 6px;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
            color: #333;
            transition: background 0.2s;
        }
        .ds-dark .ds-prompt-category-item {
            color: #ccc;
        }
        .ds-prompt-category-item:hover {
            background: #e0e0e0;
        }
        .ds-dark .ds-prompt-category-item:hover {
            background: #333;
        }
        .ds-prompt-category-item.active {
            background: #007bff;
            color: #fff;
        }
        .ds-prompt-category-actions {
            margin-left: auto;
            display: none;
            gap: 4px;
        }
        .ds-prompt-category-item:hover .ds-prompt-category-actions {
            display: flex;
        }
        .ds-prompt-icon-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: inherit;
            opacity: 0.7;
            padding: 2px;
            font-size: 12px;
        }
        .ds-prompt-icon-btn:hover {
            opacity: 1;
            background: rgba(255,255,255,0.2);
            border-radius: 4px;
        }
        .ds-prompt-add-btn {
            margin: 16px;
            padding: 8px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
        }
        .ds-prompt-add-btn:hover {
            background: #0056b3;
        }
        .ds-prompt-button-group {
            display: flex;
            gap: 8px;
            margin: 16px;
        }
        .ds-prompt-button-group .ds-prompt-add-btn {
            flex: 1;
            margin: 0;
        }
        .ds-prompt-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: #fff;
        }
        .ds-dark .ds-prompt-main {
            background: #2d2d2d;
        }
        .ds-prompt-main-header {
            padding: 16px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
        }
        .ds-dark .ds-prompt-main-header {
            border-color: #333;
        }
        #ds-main-header-actions {
            margin-left: auto;
        }
        .ds-prompt-search {
            padding: 8px 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            width: 250px;
            outline: none;
        }
        .ds-dark .ds-prompt-search {
            background: #333;
            border-color: #444;
            color: #fff;
        }
        .ds-prompt-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
        }
        .ds-dark .ds-prompt-close {
            color: #aaa;
        }
        .ds-prompt-content {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
        }
        .ds-prompt-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 16px;
        }
        .ds-prompt-card {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 16px;
            cursor: pointer;
            transition: all 0.2s;
            background: #fff;
            display: flex;
            flex-direction: column;
        }
        .ds-dark .ds-prompt-card {
            background: #333;
            border-color: #444;
        }
        .ds-prompt-card:hover {
            border-color: #007bff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            transform: translateY(-2px);
        }
        .ds-prompt-card-title {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 14px;
        }
        .ds-prompt-card-preview {
            font-size: 12px;
            color: #666;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.4;
        }
        .ds-dark .ds-prompt-card-preview {
            color: #aaa;
        }
        .ds-prompt-card-actions {
            display: none;
            gap: 4px;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #e0e0e0;
        }
        .ds-dark .ds-prompt-card-actions {
            border-color: #444;
        }
        .ds-prompt-card:hover .ds-prompt-card-actions {
            display: flex;
        }
        .ds-prompt-card-action-btn {
            flex: 1;
            padding: 6px 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background: #fff;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        }
        .ds-dark .ds-prompt-card-action-btn {
            background: #2d2d2d;
            border-color: #444;
            color: #fff;
        }
        .ds-prompt-card-action-btn:hover {
            background: #f5f5f5;
            border-color: #007bff;
        }
        .ds-dark .ds-prompt-card-action-btn:hover {
            background: #333;
        }
        .ds-prompt-card-action-btn.edit {
            color: #007bff;
            border-color: #007bff;
        }
        .ds-prompt-card-action-btn.edit:hover {
            background: #007bff;
            color: #fff;
        }
        .ds-prompt-card-action-btn.delete {
            color: #dc3545;
            border-color: #dc3545;
        }
        .ds-prompt-card-action-btn.delete:hover {
            background: #dc3545;
            color: #fff;
        }
        
        /* Dialog Styles */
        .ds-dialog-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
        }
        .ds-dialog {
            background: #fff;
            padding: 24px;
            border-radius: 8px;
            width: 320px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .ds-dark .ds-dialog {
            background: #2d2d2d;
            border: 1px solid #444;
        }
        .ds-dialog h3 {
            margin-top: 0;
            margin-bottom: 16px;
        }
        .ds-form-group {
            margin-bottom: 16px;
        }
        .ds-form-label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
        }
        .ds-form-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .ds-dark .ds-form-input {
            background: #333;
            border-color: #444;
            color: #fff;
        }
        textarea.ds-form-input {
            resize: vertical;
            min-height: 120px;
        }
        .ds-icon-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 8px;
            margin-top: 8px;
        }
        .ds-icon-option {
            width: 32px;
            height: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #eee;
            border-radius: 4px;
            cursor: pointer;
            overflow: hidden;
        }
        .ds-icon-option img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .ds-icon-option:hover, .ds-icon-option.selected {
            background: #e6f2ff;
            border-color: #007bff;
        }
        .ds-dark .ds-icon-option {
            border-color: #444;
        }
        .ds-dark .ds-icon-option:hover, .ds-dark .ds-icon-option.selected {
            background: #0056b3;
            border-color: #007bff;
        }
        .ds-dialog-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 24px;
        }
        .ds-btn {
            padding: 8px 16px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 14px;
        }
        .ds-btn-secondary {
            background: #e0e0e0;
            color: #333;
        }
        .ds-btn-primary {
            background: #007bff;
            color: white;
        }
        .ds-btn-primary:disabled {
            background: #ccc;
            color: #666;
            cursor: not-allowed;
            opacity: 0.6;
        }
        .ds-dark .ds-btn-primary:disabled {
            background: #555;
            color: #888;
        }
        .ds-upload-btn {
            margin-top: 8px;
            font-size: 12px;
            color: #007bff;
            background: none;
            border: 1px dashed #007bff;
            width: 100%;
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
        }
        .ds-upload-btn:hover {
            background: rgba(0, 123, 255, 0.1);
        }
        
        /* Model Configuration Styles */
        .ds-model-config-modal {
            width: 900px;
            height: 700px;
            background: #fff;
            border-radius: 12px;
            display: flex;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            position: relative;
        }
        .ds-dark .ds-model-config-modal {
            background: #2d2d2d;
            color: #fff;
        }
        .ds-model-config-sidebar {
            width: 250px;
            background: #f5f5f5;
            border-right: 1px solid #e0e0e0;
            display: flex;
            flex-direction: column;
        }
        .ds-dark .ds-model-config-sidebar {
            background: #1e1e1e;
            border-color: #333;
        }
        .ds-model-config-sidebar-header {
            padding: 16px;
            font-weight: bold;
            font-size: 16px;
            border-bottom: 1px solid #e0e0e0;
        }
        .ds-dark .ds-model-config-sidebar-header {
            border-color: #333;
        }
        .ds-model-list {
            flex: 1;
            overflow-y: auto;
            padding: 8px;
        }
        .ds-model-item {
            padding: 12px;
            cursor: pointer;
            border-radius: 6px;
            margin-bottom: 4px;
            color: #333;
            transition: background 0.2s;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .ds-dark .ds-model-item {
            color: #ccc;
        }
        .ds-model-item:hover {
            background: #e0e0e0;
        }
        .ds-dark .ds-model-item:hover {
            background: #333;
        }
        .ds-model-item.active {
            background: #007bff;
            color: #fff;
        }
        .ds-model-item.default {
            border: 2px solid #28a745;
        }
        .ds-model-item-name {
            font-weight: 500;
            font-size: 14px;
        }
        .ds-model-item-provider {
            font-size: 12px;
            opacity: 0.8;
        }
        .ds-model-item-actions {
            display: none;
            gap: 4px;
        }
        .ds-model-item:hover .ds-model-item-actions {
            display: flex;
        }
        /* Model Card Styles */
        .ds-model-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 16px;
        }
        .ds-model-card {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 16px;
            cursor: pointer;
            transition: all 0.2s;
            background: #fff;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        .ds-dark .ds-model-card {
            background: #333;
            border-color: #444;
        }
        .ds-model-card:hover {
            border-color: #007bff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }
        .ds-model-card.active {
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }
        .ds-model-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
        }
        .ds-model-card-title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 4px;
            flex: 1;
        }
        .ds-model-card-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
            background: #28a745;
            color: #fff;
            margin-left: 8px;
        }
        .ds-dark .ds-model-card-badge {
            background: #22c55e;
            color: #fff;
        }
        .ds-model-card-provider {
            font-size: 13px;
            color: #666;
            margin-bottom: 8px;
        }
        .ds-dark .ds-model-card-provider {
            color: #aaa;
        }
        .ds-model-card-actions {
            display: flex;
            gap: 8px;
            margin-top: auto;
            padding-top: 12px;
            border-top: 1px solid #e0e0e0;
        }
        .ds-dark .ds-model-card-actions {
            border-color: #444;
        }
        .ds-model-card-btn {
            flex: 1;
            padding: 6px 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background: #fff;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
        }
        .ds-dark .ds-model-card-btn {
            background: #2d2d2d;
            border-color: #444;
            color: #fff;
        }
        .ds-model-card-btn:hover {
            background: #f5f5f5;
            border-color: #007bff;
        }
        .ds-dark .ds-model-card-btn:hover {
            background: #333;
        }
        .ds-model-card-btn.delete {
            color: #dc3545;
            border-color: #dc3545;
        }
        .ds-model-card-btn.delete:hover {
            background: #dc3545;
            color: #fff;
        }
        .ds-model-card-btn:disabled {
            background: #e0e0e0;
            color: #999;
            cursor: not-allowed;
            opacity: 0.6;
        }
        .ds-dark .ds-model-card-btn:disabled {
            background: #444;
            color: #666;
        }
        .ds-model-config-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: #fff;
        }
        .ds-dark .ds-model-config-main {
            background: #2d2d2d;
        }
        .ds-model-config-header {
            padding: 16px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .ds-dark .ds-model-config-header {
            border-color: #333;
        }
        .ds-model-config-content {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
        }
        .ds-model-form {
            max-width: 500px;
        }
        .ds-model-form-group {
            margin-bottom: 20px;
        }
        .ds-model-form-label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
        }
        .ds-model-form-input, .ds-model-form-select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            box-sizing: border-box;
            font-size: 14px;
        }
        .ds-dark .ds-model-form-input, .ds-dark .ds-model-form-select {
            background: #333;
            border-color: #444;
            color: #fff;
        }
        .ds-model-form-input:focus, .ds-model-form-select:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }
        .ds-model-test-result {
            margin-top: 8px;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 13px;
        }
        .ds-model-test-result.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .ds-model-test-result.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .ds-dark .ds-model-test-result.success {
            background: #1e3a1e;
            color: #4ade80;
            border-color: #22c55e;
        }
        .ds-dark .ds-model-test-result.error {
            background: #3a1e1e;
            color: #f87171;
            border-color: #ef4444;
        }
        .ds-model-config-buttons {
            padding: 16px 24px;
            border-top: 1px solid #e0e0e0;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }
        .ds-dark .ds-model-config-buttons {
            border-color: #333;
        }
        .ds-model-empty-state {
            text-align: center;
            color: #999;
            margin-top: 100px;
        }
        .ds-dark .ds-model-empty-state {
            color: #aaa;
        }
        
        /* Prompt Config Styles */
        .ds-prompt-config-modal {
            width: 700px;
            height: 600px;
            background: #fff;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            position: relative;
        }
        .ds-dark .ds-prompt-config-modal {
            background: #2d2d2d;
            color: #fff;
        }
        .ds-prompt-config-header {
            padding: 16px 24px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .ds-dark .ds-prompt-config-header {
            border-color: #333;
        }
        .ds-prompt-config-content {
            flex: 1;
            padding: 24px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .ds-prompt-config-textarea {
            flex: 1;
            width: 100%;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
            font-family: monospace;
            resize: none;
            outline: none;
            box-sizing: border-box;
        }
        .ds-dark .ds-prompt-config-textarea {
            background: #333;
            border-color: #444;
            color: #fff;
        }
        .ds-prompt-config-textarea:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }
        .ds-prompt-config-buttons {
            padding: 16px 24px;
            border-top: 1px solid #e0e0e0;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }
        .ds-dark .ds-prompt-config-buttons {
            border-color: #333;
        }
    `;
    document.head.appendChild(style);
}

// --- Prompt Manager Logic ---
const PromptManager = {
    state: {
        isOpen: false,
        activeCategoryId: 'coding',
        searchQuery: '',
        customCategories: [],
        categories: [], // Combined premade + custom
        models: [],
        activeModelId: null,
        promptConfig: '请根据以下用户输入的内容，生成一个合适的提示词标题和内容。\n\n用户输入的内容：\n{userContent}\n\n要求：\n1. 标题应该简洁明了，能够准确概括提示词的用途\n2. 内容应该详细且具有指导性，能够帮助用户更好地使用AI\n3. 请以JSON格式返回，格式为：{"title": "标题", "content": "内容"}' // 默认提示词配置
    },

    init() {
        injectStyles();
        this.loadCustomCategories();
        this.loadModels();
        this.loadPromptConfig();
        // Listen for storage changes
        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (namespace === 'local') {
                if (changes.customCategories) {
                    this.loadCustomCategories();
                }
                if (changes.models) {
                    this.loadModels();
                }
                if (changes.promptConfig) {
                    this.loadPromptConfig();
                }
            }
        });
    },

    loadPromptConfig() {
        chrome.storage.local.get(['promptConfig'], (result) => {
            if (result.promptConfig) {
                this.state.promptConfig = result.promptConfig;
            }
        });
    },

    savePromptConfig() {
        chrome.storage.local.set({ promptConfig: this.state.promptConfig });
    },

    loadCustomCategories() {
        chrome.storage.local.get(['customCategories'], (result) => {
            this.state.customCategories = result.customCategories || [];
            this.updateCategories();
            if (this.state.isOpen) {
                this.renderSidebar();
                this.renderPrompts();
            }
        });
    },

    loadModels() {
        chrome.storage.local.get(['models'], (result) => {
            this.state.models = result.models || [];
        });
    },

    saveModels() {
        chrome.storage.local.set({ models: this.state.models });
    },

    updateCategories() {
        this.state.categories = [...PREMADE_DATA, ...this.state.customCategories];
    },

    saveCustomCategories() {
        chrome.storage.local.set({ customCategories: this.state.customCategories });
        this.updateCategories();
        this.renderSidebar();
    },

    toggle() {
        if (this.state.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    open() {
        if (this.state.isOpen) return;
        this.state.isOpen = true;
        this.render();
    },

    close() {
        const overlay = document.querySelector('.ds-prompt-modal-overlay');
        if (overlay) {
            overlay.remove();
        }
        this.state.isOpen = false;
    },

    renderIcon(icon) {
        if (!icon) return '📁';
        if (icon.startsWith('data:') || icon.startsWith('http')) {
            return `<img src="${icon}" style="width: 16px; height: 16px; object-fit: contain;">`;
        }
        return icon;
    },

    render() {
        const overlay = document.createElement('div');
        overlay.className = 'ds-prompt-modal-overlay';
        
        // Check for dark mode
        if (document.documentElement.classList.contains('dark')) {
            overlay.classList.add('ds-dark');
        }

        overlay.innerHTML = `
            <div class="ds-prompt-modal">
                <div class="ds-prompt-sidebar">
                    <div class="ds-prompt-sidebar-header">提示词库</div>
                    <div class="ds-prompt-categories" id="ds-categories-list"></div>
                    <button class="ds-prompt-add-btn" id="ds-add-category-btn">+ 新建分类</button>
                    <div class="ds-prompt-button-group">
                        <button class="ds-prompt-add-btn" id="ds-model-config-btn">⚙️ 模型配置</button>
                        <button class="ds-prompt-add-btn" id="ds-prompt-config-btn">📝 提示词配置</button>
                    </div>
                </div>
                <div class="ds-prompt-main">
                    <div class="ds-prompt-main-header">
                        <input type="text" class="ds-prompt-search" placeholder="搜索提示词..." id="ds-prompt-search-input">
                        <div id="ds-main-header-actions"></div>
                        <button class="ds-prompt-close" id="ds-prompt-close-btn">&times;</button>
                    </div>
                    <div class="ds-prompt-content" id="ds-prompt-content-area"></div>
                </div>
            </div>
        `;

        // Event Listeners
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.close();
        });

        const closeBtn = overlay.querySelector('#ds-prompt-close-btn');
        closeBtn.addEventListener('click', () => this.close());

        const searchInput = overlay.querySelector('#ds-prompt-search-input');
        searchInput.addEventListener('input', (e) => {
            this.state.searchQuery = e.target.value;
            this.renderPrompts();
        });

        const addCategoryBtn = overlay.querySelector('#ds-add-category-btn');
        addCategoryBtn.addEventListener('click', () => this.showAddCategoryDialog());

        const modelConfigBtn = overlay.querySelector('#ds-model-config-btn');
        modelConfigBtn.addEventListener('click', () => this.showModelConfigDialog());

        const promptConfigBtn = overlay.querySelector('#ds-prompt-config-btn');
        promptConfigBtn.addEventListener('click', () => this.showPromptConfigDialog());

        document.body.appendChild(overlay);
        this.renderSidebar();
        this.renderPrompts();
    },

    renderSidebar() {
        const listContainer = document.getElementById('ds-categories-list');
        if (!listContainer) return;

        listContainer.innerHTML = '';
        
        this.state.categories.forEach(category => {
            const item = document.createElement('div');
            item.className = `ds-prompt-category-item ${category.id === this.state.activeCategoryId ? 'active' : ''}`;
            
            let actionsHtml = '';
            if (category.is_custom) {
                actionsHtml = `
                    <div class="ds-prompt-category-actions">
                        <button class="ds-prompt-icon-btn edit-btn" title="编辑">✏️</button>
                        <button class="ds-prompt-icon-btn delete-btn" title="删除">🗑️</button>
                    </div>
                `;
            }

            item.innerHTML = `
                <span class="ds-category-icon">${this.renderIcon(category.icon)}</span>
                <span class="ds-category-name">${category.name}</span>
                ${actionsHtml}
            `;

            // Click to select
            item.addEventListener('click', (e) => {
                if (e.target.closest('.ds-prompt-icon-btn')) return;
                this.state.activeCategoryId = category.id;
                this.renderSidebar(); // Re-render to update active class
                this.renderPrompts();
            });

            // Edit and Delete
            if (category.is_custom) {
                const editBtn = item.querySelector('.edit-btn');
                const deleteBtn = item.querySelector('.delete-btn');

                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showAddCategoryDialog(category);
                });

                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm(`确定要删除分类 "${category.name}" 吗？`)) {
                        this.deleteCategory(category.id);
                    }
                });
            }

            listContainer.appendChild(item);
        });
    },

    renderPrompts() {
        const contentArea = document.getElementById('ds-prompt-content-area');
        const actionsContainer = document.getElementById('ds-main-header-actions');
        if (!contentArea || !actionsContainer) return;

        contentArea.innerHTML = '';
        actionsContainer.innerHTML = '';
        
        const activeCategory = this.state.categories.find(c => c.id === this.state.activeCategoryId);
        if (!activeCategory) return;

        if (activeCategory.is_custom) {
            const addPromptBtn = document.createElement('button');
            addPromptBtn.textContent = '+ 创建提示词';
            addPromptBtn.className = 'ds-btn ds-btn-primary';
            addPromptBtn.addEventListener('click', () => this.showAddPromptDialog());
            actionsContainer.appendChild(addPromptBtn);
        }

        const grid = document.createElement('div');
        grid.className = 'ds-prompt-grid';

        const prompts = activeCategory.prompts.filter(p => 
            p.title.toLowerCase().includes(this.state.searchQuery.toLowerCase()) || 
            p.content.toLowerCase().includes(this.state.searchQuery.toLowerCase())
        );

        if (prompts.length === 0) {
            contentArea.innerHTML = '<div style="text-align:center; color:#999; margin-top:40px;">暂无提示词</div>';
            return;
        }

        prompts.forEach((prompt, index) => {
            const card = document.createElement('div');
            card.className = 'ds-prompt-card';
            
            // 如果是自定义分类，添加编辑和删除按钮
            let actionsHtml = '';
            if (activeCategory.is_custom) {
                actionsHtml = `
                    <div class="ds-prompt-card-actions">
                        <button class="ds-prompt-card-action-btn edit" data-prompt-index="${index}">编辑</button>
                        <button class="ds-prompt-card-action-btn delete" data-prompt-index="${index}">删除</button>
                    </div>
                `;
            }
            
            card.innerHTML = `
                <div class="ds-prompt-card-title">${prompt.title}</div>
                <div class="ds-prompt-card-preview">${prompt.content}</div>
                ${actionsHtml}
            `;
            
            // 点击卡片主体区域插入提示词
            const cardTitle = card.querySelector('.ds-prompt-card-title');
            const cardPreview = card.querySelector('.ds-prompt-card-preview');
            [cardTitle, cardPreview].forEach(el => {
                el.addEventListener('click', () => {
                    this.insertPrompt(prompt.content);
                    this.close();
                });
            });
            
            // 如果是自定义分类，添加编辑和删除事件
            if (activeCategory.is_custom) {
                const editBtn = card.querySelector('.edit');
                const deleteBtn = card.querySelector('.delete');
                
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // 找到原始提示词在分类中的索引
                    const originalIndex = activeCategory.prompts.findIndex(p => 
                        p.title === prompt.title && p.content === prompt.content
                    );
                    if (originalIndex !== -1) {
                        this.showAddPromptDialog(activeCategory.prompts[originalIndex], originalIndex);
                    }
                });
                
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm(`确定要删除提示词 "${prompt.title}" 吗？`)) {
                        // 找到原始提示词在分类中的索引
                        const originalIndex = activeCategory.prompts.findIndex(p => 
                            p.title === prompt.title && p.content === prompt.content
                        );
                        if (originalIndex !== -1) {
                            this.deletePrompt(originalIndex);
                        }
                    }
                });
            }

            grid.appendChild(card);
        });

        contentArea.appendChild(grid);
    },

    showAddPromptDialog(promptToEdit = null, promptIndex = null) {
        const modal = document.querySelector('.ds-prompt-modal');
        if (!modal) return;

        const dialogOverlay = document.createElement('div');
        dialogOverlay.className = 'ds-dialog-overlay';

        const isEdit = !!promptToEdit;

        dialogOverlay.innerHTML = `
            <div class="ds-dialog" style="width: 480px;">
                <h3>${isEdit ? '编辑提示词' : '新建提示词'}</h3>
                <div class="ds-form-group">
                    <label class="ds-form-label">标题</label>
                    <input type="text" class="ds-form-input" id="ds-prompt-title" value="${promptToEdit ? promptToEdit.title : ''}">
                </div>
                <div class="ds-form-group">
                    <label class="ds-form-label">内容</label>
                    <textarea class="ds-form-input" id="ds-prompt-content" rows="8">${promptToEdit ? promptToEdit.content : ''}</textarea>
                </div>
                <div class="ds-dialog-buttons">
                    <button class="ds-btn ds-btn-secondary" id="ds-prompt-cancel">取消</button>
                    ${!isEdit ? '<button class="ds-btn ds-btn-secondary" id="ds-prompt-generate">✨ 一键生成</button>' : ''}
                    <button class="ds-btn ds-btn-primary" id="ds-prompt-save">保存</button>
                </div>
            </div>
        `;

        modal.appendChild(dialogOverlay);

        const closeDialog = () => dialogOverlay.remove();

        document.getElementById('ds-prompt-cancel').addEventListener('click', closeDialog);
        
        // 一键生成按钮（仅新建时显示）
        if (!isEdit) {
            const generateBtn = document.getElementById('ds-prompt-generate');
            if (generateBtn) {
                generateBtn.addEventListener('click', () => {
                    this.generatePrompt(dialogOverlay);
                });
            }
        }
        
        document.getElementById('ds-prompt-save').addEventListener('click', () => {
            const title = document.getElementById('ds-prompt-title').value.trim();
            const content = document.getElementById('ds-prompt-content').value.trim();

            if (!title || !content) {
                alert('标题和内容不能为空！');
                return;
            }

            this.savePrompt({ title, content }, promptIndex);
            closeDialog();
        });
    },

    getDefaultModel() {
        return this.state.models.find(m => m.isDefault) || this.state.models[0];
    },

    async generatePrompt(dialogOverlay) {
        // 获取默认模型
        const defaultModel = this.getDefaultModel();
        if (!defaultModel) {
            alert('请先配置模型！');
            return;
        }

        // 获取用户输入的内容
        const contentInput = document.getElementById('ds-prompt-content');
        const userContent = contentInput.value.trim();
        
        if (!userContent) {
            alert('请先输入一些内容作为参考！');
            return;
        }

        // 构建完整的提示词：使用模板，将用户输入的内容替换到占位符位置
        const fullPrompt = this.state.promptConfig.replace('{userContent}', userContent);

        // 禁用按钮，显示加载状态
        const generateBtn = document.getElementById('ds-prompt-generate');
        const saveBtn = document.getElementById('ds-prompt-save');
        const originalGenerateText = generateBtn.textContent;
        generateBtn.disabled = true;
        saveBtn.disabled = true;
        generateBtn.textContent = '生成中...';

        try {
            // 构建API端点URL
            let apiUrl = defaultModel.baseUrl.replace(/\/$/, '');
            if (defaultModel.provider === 'deepseek') {
                apiUrl += '/v1/chat/completions';
            } else if (defaultModel.provider === 'volcengine') {
                apiUrl += '/chat/completions';
            } else {
                apiUrl += '/v1/chat/completions';
            }

            // 构建请求体
            const requestBody = {
                model: defaultModel.model,
                messages: [
                    {
                        role: 'user',
                        content: fullPrompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            };

            // 发送API请求
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${defaultModel.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('响应格式不正确');
            }

            const responseText = data.choices[0].message.content.trim();
            
            // 尝试解析JSON
            let result;
            try {
                // 尝试提取JSON部分（可能在代码块中）
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    result = JSON.parse(jsonMatch[0]);
                } else {
                    result = JSON.parse(responseText);
                }
            } catch (parseError) {
                // 如果解析失败，尝试智能提取
                const titleMatch = responseText.match(/标题[：:]\s*["']?([^"'\n]+)["']?/i) || 
                                   responseText.match(/title[：:]\s*["']?([^"'\n]+)["']?/i);
                const contentMatch = responseText.match(/内容[：:]\s*([\s\S]*?)(?:\n\n|\n$|$)/i) ||
                                     responseText.match(/content[：:]\s*([\s\S]*?)(?:\n\n|\n$|$)/i);
                
                if (titleMatch && contentMatch) {
                    result = {
                        title: titleMatch[1].trim(),
                        content: contentMatch[1].trim()
                    };
                } else {
                    // 如果还是无法解析，使用默认格式
                    const lines = responseText.split('\n').filter(l => l.trim());
                    result = {
                        title: lines[0] || '新提示词',
                        content: lines.slice(1).join('\n') || responseText
                    };
                }
            }

            // 填充到表单
            const titleInput = document.getElementById('ds-prompt-title');
            titleInput.value = result.title || '新提示词';
            contentInput.value = result.content || responseText;

            alert('提示词生成成功！');
        } catch (error) {
            console.error('生成提示词失败:', error);
            alert('生成提示词失败：' + (error.message || '未知错误'));
        } finally {
            // 恢复按钮状态
            generateBtn.disabled = false;
            saveBtn.disabled = false;
            generateBtn.textContent = originalGenerateText;
        }
    },

    savePrompt(promptData, promptIndex = null) {
        const activeCategory = this.state.categories.find(c => c.id === this.state.activeCategoryId);
        if (!activeCategory || !activeCategory.is_custom) return;

        // 如果是编辑模式，更新现有提示词；否则添加新提示词
        if (promptIndex !== null && promptIndex >= 0 && promptIndex < activeCategory.prompts.length) {
            activeCategory.prompts[promptIndex] = promptData;
        } else {
            activeCategory.prompts.push(promptData);
        }
        
        const categoryIndex = this.state.customCategories.findIndex(c => c.id === this.state.activeCategoryId);
        if (categoryIndex > -1) {
            this.state.customCategories[categoryIndex] = activeCategory;
            this.saveCustomCategories();
            this.renderPrompts();
        }
    },

    deletePrompt(promptIndex) {
        const activeCategory = this.state.categories.find(c => c.id === this.state.activeCategoryId);
        if (!activeCategory || !activeCategory.is_custom) return;
        
        if (promptIndex >= 0 && promptIndex < activeCategory.prompts.length) {
            activeCategory.prompts.splice(promptIndex, 1);
            
            const categoryIndex = this.state.customCategories.findIndex(c => c.id === this.state.activeCategoryId);
            if (categoryIndex > -1) {
                this.state.customCategories[categoryIndex] = activeCategory;
                this.saveCustomCategories();
                this.renderPrompts();
            }
        }
    },

    showAddCategoryDialog(categoryToEdit = null) {
        const modal = document.querySelector('.ds-prompt-modal');
        if (!modal) return;

        // Remove existing dialog if any
        const existingDialog = document.querySelector('.ds-dialog-overlay');
        if (existingDialog) existingDialog.remove();

        const dialogOverlay = document.createElement('div');
        dialogOverlay.className = 'ds-dialog-overlay';

        const isEdit = !!categoryToEdit;
        let selectedIcon = categoryToEdit ? categoryToEdit.icon : PREMADE_ICONS[0];

        // Determine if selected icon is custom (not in premade list)
        let isCustomIcon = !PREMADE_ICONS.includes(selectedIcon);

        dialogOverlay.innerHTML = `
            <div class="ds-dialog">
                <h3>${isEdit ? '编辑分类' : '新建分类'}</h3>
                <div class="ds-form-group">
                    <label class="ds-form-label">分类名称</label>
                    <input type="text" class="ds-form-input" id="ds-cat-name" value="${categoryToEdit ? categoryToEdit.name : ''}">
                </div>
                <div class="ds-form-group">
                    <label class="ds-form-label">选择图标</label>
                    <div class="ds-icon-grid" id="ds-icon-selector">
                        ${PREMADE_ICONS.map(icon => `
                            <div class="ds-icon-option ${icon === selectedIcon ? 'selected' : ''}" data-icon="${icon}">${icon}</div>
                        `).join('')}
                    </div>
                    <button class="ds-upload-btn" id="ds-upload-icon-btn">
                        ${isCustomIcon ? '已上传自定义图标 (点击更换)' : '上传自定义图标'}
                    </button>
                    <input type="file" id="ds-icon-file-input" accept="image/*" style="display:none">
                </div>
                <div class="ds-dialog-buttons">
                    <button class="ds-btn ds-btn-secondary" id="ds-dialog-cancel">取消</button>
                    <button class="ds-btn ds-btn-primary" id="ds-dialog-save">保存</button>
                </div>
            </div>
        `;

        modal.appendChild(dialogOverlay);

        // Icon Selection Logic
        const iconGrid = dialogOverlay.querySelector('#ds-icon-selector');
        iconGrid.addEventListener('click', (e) => {
            const option = e.target.closest('.ds-icon-option');
            if (option) {
                dialogOverlay.querySelectorAll('.ds-icon-option').forEach(el => el.classList.remove('selected'));
                option.classList.add('selected');
                selectedIcon = option.dataset.icon;
                isCustomIcon = false;
                dialogOverlay.querySelector('#ds-upload-icon-btn').textContent = '上传自定义图标';
            }
        });

        // Upload Logic
        const uploadBtn = dialogOverlay.querySelector('#ds-upload-icon-btn');
        const fileInput = dialogOverlay.querySelector('#ds-icon-file-input');

        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    selectedIcon = event.target.result;
                    isCustomIcon = true;
                    // Deselect grid options
                    dialogOverlay.querySelectorAll('.ds-icon-option').forEach(el => el.classList.remove('selected'));
                    uploadBtn.textContent = '已上传: ' + file.name;
                };
                reader.readAsDataURL(file);
            }
        });

        // Save Logic
        dialogOverlay.querySelector('#ds-dialog-save').addEventListener('click', () => {
            const name = dialogOverlay.querySelector('#ds-cat-name').value.trim();
            if (!name) {
                alert('请输入分类名称');
                return;
            }

            // Check for duplicates (excluding self if editing)
            const isDuplicate = this.state.categories.some(c => 
                c.name === name && (!isEdit || c.id !== categoryToEdit.id)
            );
            
            if (isDuplicate) {
                alert('分类名称已存在');
                return;
            }

            if (isEdit) {
                this.updateCategory(categoryToEdit.id, name, selectedIcon);
            } else {
                this.addCategory(name, selectedIcon);
            }
            dialogOverlay.remove();
        });

        // Cancel Logic
        dialogOverlay.querySelector('#ds-dialog-cancel').addEventListener('click', () => {
            dialogOverlay.remove();
        });
    },

    addCategory(name, icon) {
        const newCategory = {
            id: 'custom_' + Date.now(),
            name,
            icon,
            is_custom: true,
            prompts: [] // Initially empty
        };
        this.state.customCategories.push(newCategory);
        this.saveCustomCategories();
        this.state.activeCategoryId = newCategory.id;
        this.renderSidebar();
        this.renderPrompts();
    },

    updateCategory(id, name, icon) {
        const category = this.state.customCategories.find(c => c.id === id);
        if (category) {
            category.name = name;
            category.icon = icon;
            this.saveCustomCategories();
            this.renderSidebar();
        }
    },

    deleteCategory(id) {
        this.state.customCategories = this.state.customCategories.filter(c => c.id !== id);
        this.saveCustomCategories();
        if (this.state.activeCategoryId === id) {
            this.state.activeCategoryId = PREMADE_DATA[0].id;
        }
        this.renderSidebar();
        this.renderPrompts();
    },

    showPromptConfigDialog() {
        const overlay = document.createElement('div');
        overlay.className = 'ds-prompt-modal-overlay';
        
        // Check for dark mode
        if (document.documentElement.classList.contains('dark')) {
            overlay.classList.add('ds-dark');
        }

        overlay.innerHTML = `
            <div class="ds-prompt-config-modal">
                <div class="ds-prompt-config-header">
                    <h3>提示词配置</h3>
                    <button class="ds-prompt-close" id="ds-prompt-config-close">&times;</button>
                </div>
                <div class="ds-prompt-config-content">
                    <label class="ds-form-label" style="margin-bottom: 12px;">提示词模板（用于帮助生成提示词的标题和内容）</label>
                    <textarea class="ds-prompt-config-textarea" id="ds-prompt-config-textarea" placeholder="请输入提示词模板...">${this.state.promptConfig}</textarea>
                </div>
                <div class="ds-prompt-config-buttons">
                    <button class="ds-btn ds-btn-secondary" id="ds-prompt-config-cancel">取消</button>
                    <button class="ds-btn ds-btn-primary" id="ds-prompt-config-save">保存</button>
                </div>
            </div>
        `;

        // Event Listeners
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        overlay.querySelector('#ds-prompt-config-close').addEventListener('click', () => {
            overlay.remove();
        });

        overlay.querySelector('#ds-prompt-config-cancel').addEventListener('click', () => {
            overlay.remove();
        });

        overlay.querySelector('#ds-prompt-config-save').addEventListener('click', () => {
            const configText = overlay.querySelector('#ds-prompt-config-textarea').value.trim();
            if (!configText) {
                alert('提示词配置不能为空！');
                return;
            }
            this.state.promptConfig = configText;
            this.savePromptConfig();
            overlay.remove();
            alert('提示词配置已保存！');
        });

        document.body.appendChild(overlay);
    },

    showModelConfigDialog() {
        const overlay = document.createElement('div');
        overlay.className = 'ds-prompt-modal-overlay';
        
        // Check for dark mode
        if (document.documentElement.classList.contains('dark')) {
            overlay.classList.add('ds-dark');
        }

        overlay.innerHTML = `
            <div class="ds-model-config-modal">
                <div class="ds-model-config-sidebar">
                    <div class="ds-model-config-sidebar-header">模型配置</div>
                    <button class="ds-prompt-add-btn" id="ds-add-model-btn" style="margin: 16px;">+ 新增模型</button>
                </div>
                <div class="ds-model-config-main">
                    <div class="ds-model-config-header">
                        <h3 id="ds-model-config-title">模型列表</h3>
                        <button class="ds-prompt-close" id="ds-model-config-close">&times;</button>
                    </div>
                    <div class="ds-model-config-content" id="ds-model-config-content">
                        <div class="ds-model-grid" id="ds-model-list"></div>
                    </div>
                    <div class="ds-model-config-buttons" id="ds-model-config-buttons" style="display: none;">
                        <button class="ds-btn ds-btn-secondary" id="ds-model-cancel-btn">取消</button>
                        <button class="ds-btn ds-btn-secondary" id="ds-model-test-btn">测试连接</button>
                        <button class="ds-btn ds-btn-primary" id="ds-model-save-btn">保存</button>
                    </div>
                </div>
            </div>
        `;

        // Event Listeners
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        overlay.querySelector('#ds-model-config-close').addEventListener('click', () => {
            overlay.remove();
        });

        overlay.querySelector('#ds-add-model-btn').addEventListener('click', () => {
            this.showAddModelDialog();
        });

        document.body.appendChild(overlay);
        this.renderModelList();
    },

    renderModelList() {
        const listContainer = document.getElementById('ds-model-list');
        if (!listContainer) return;

        // 如果列表容器不是grid，改为grid
        if (!listContainer.classList.contains('ds-model-grid')) {
            listContainer.className = 'ds-model-grid';
        }

        listContainer.innerHTML = '';
        
        if (this.state.models.length === 0) {
            listContainer.innerHTML = '<div class="ds-model-empty-state" style="grid-column: 1 / -1;"><p>暂无模型，请点击"新增模型"添加</p></div>';
            return;
        }

        this.state.models.forEach(model => {
            const card = document.createElement('div');
            card.className = `ds-model-card ${model.id === this.state.activeModelId ? 'active' : ''}`;
            
            const defaultBadge = model.isDefault ? '<span class="ds-model-card-badge">默认</span>' : '';
            
            card.innerHTML = `
                <div class="ds-model-card-header">
                    <div>
                        <div class="ds-model-card-title">
                            ${model.displayName}${defaultBadge}
                        </div>
                        <div class="ds-model-card-provider">供应商: ${this.getProviderName(model.provider)}</div>
                    </div>
                </div>
                <div class="ds-model-card-actions">
                    <button class="ds-model-card-btn edit-btn">编辑</button>
                    <button class="ds-model-card-btn set-default-btn" ${model.isDefault ? 'disabled' : ''}>${model.isDefault ? '默认' : '设置默认'}</button>
                    <button class="ds-model-card-btn delete delete-btn">删除</button>
                </div>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.closest('.ds-model-card-actions')) return;
                this.state.activeModelId = model.id;
                this.renderModelList();
                this.renderModelConfig();
            });

            const editBtn = card.querySelector('.edit-btn');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.state.activeModelId = model.id;
                this.renderModelList();
                this.renderModelConfig();
            });

            const setDefaultBtn = card.querySelector('.set-default-btn');
            if (setDefaultBtn) {
                if (model.isDefault) {
                    setDefaultBtn.disabled = true;
                } else {
                    setDefaultBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.setDefaultModel(model.id);
                    });
                }
            }

            const deleteBtn = card.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`确定要删除模型 "${model.displayName}" 吗？`)) {
                    this.deleteModel(model.id);
                }
            });

            listContainer.appendChild(card);
        });
    },

    renderModelConfig() {
        const contentArea = document.getElementById('ds-model-config-content');
        const buttonsArea = document.getElementById('ds-model-config-buttons');
        const titleArea = document.getElementById('ds-model-config-title');
        
        if (!contentArea || !buttonsArea || !titleArea) return;

        const model = this.state.models.find(m => m.id === this.state.activeModelId);
        if (!model) {
            // 没有选中模型时，隐藏配置表单，显示列表
            buttonsArea.style.display = 'none';
            titleArea.textContent = '模型列表';
            // 重新创建列表容器并渲染列表
            contentArea.innerHTML = '<div class="ds-model-grid" id="ds-model-list"></div>';
            this.renderModelList();
            return;
        }

        titleArea.textContent = model.displayName;

        contentArea.innerHTML = `
            <div class="ds-model-form">
                <div class="ds-model-form-group">
                    <label class="ds-model-form-label">供应商</label>
                    <select class="ds-model-form-select" id="ds-model-provider">
                        <option value="deepseek" ${model.provider === 'deepseek' ? 'selected' : ''}>DeepSeek</option>
                        <option value="volcengine" ${model.provider === 'volcengine' ? 'selected' : ''}>火山引擎</option>
                    </select>
                </div>
                <div class="ds-model-form-group">
                    <label class="ds-model-form-label">基础URL</label>
                    <input type="text" class="ds-model-form-input" id="ds-model-baseurl" value="${model.baseUrl}" placeholder="https://api.deepseek.com">
                </div>
                <div class="ds-model-form-group">
                    <label class="ds-model-form-label">API密钥</label>
                    <input type="password" class="ds-model-form-input" id="ds-model-apikey" value="${model.apiKey}" placeholder="输入API密钥">
                </div>
                <div class="ds-model-form-group">
                    <label class="ds-model-form-label">模型名称</label>
                    <input type="text" class="ds-model-form-input" id="ds-model-name" value="${model.model}" placeholder="deepseek-chat">
                </div>
                <div class="ds-model-form-group">
                    <label class="ds-model-form-label">显示名称</label>
                    <input type="text" class="ds-model-form-input" id="ds-model-displayname" value="${model.displayName}" placeholder="模型别名">
                </div>
                <div class="ds-model-form-group">
                    <label class="ds-model-form-label">
                        <input type="checkbox" id="ds-model-default" ${model.isDefault ? 'checked' : ''}> 设为默认模型
                    </label>
                </div>
                <div id="ds-model-test-result"></div>
            </div>
        `;

        buttonsArea.style.display = 'flex';

        // 绑定事件
        document.getElementById('ds-model-provider').addEventListener('change', (e) => {
            const provider = e.target.value;
            const baseUrlInput = document.getElementById('ds-model-baseurl');
            if (provider === 'deepseek') {
                baseUrlInput.value = 'https://api.deepseek.com';
            } else if (provider === 'volcengine') {
                baseUrlInput.value = 'https://ark.cn-beijing.volces.com/api/v3';
            }
        });

        document.getElementById('ds-model-cancel-btn').addEventListener('click', () => {
            this.state.activeModelId = null;
            this.renderModelList();
            this.renderModelConfig();
        });

        document.getElementById('ds-model-test-btn').addEventListener('click', () => {
            this.testModelConnection();
        });

        document.getElementById('ds-model-save-btn').addEventListener('click', () => {
            this.saveModelConfig();
        });
    },

    getProviderName(provider) {
        const providerNames = {
            'deepseek': 'DeepSeek',
            'volcengine': '火山引擎'
        };
        return providerNames[provider] || provider;
    },

    deleteModel(id) {
        const modelIndex = this.state.models.findIndex(m => m.id === id);
        if (modelIndex === -1) return;

        const deletedModel = this.state.models[modelIndex];
        this.state.models.splice(modelIndex, 1);

        // 如果删除的是默认模型，将第一个模型设为默认
        if (deletedModel.isDefault && this.state.models.length > 0) {
            this.state.models[0].isDefault = true;
        }

        this.saveModels();
        
        // 如果删除的是当前选中的模型，清空选择
        if (this.state.activeModelId === id) {
            this.state.activeModelId = null;
        }

        this.renderModelList();
        this.renderModelConfig();
    },

    setDefaultModel(id) {
        const model = this.state.models.find(m => m.id === id);
        if (!model) return;

        // 清除其他模型的默认状态
        this.state.models.forEach(m => m.isDefault = false);
        
        // 设置当前模型为默认
        model.isDefault = true;
        
        this.saveModels();
        this.renderModelList();
        this.renderModelConfig();
    },

    showAddModelDialog() {
        const modal = document.querySelector('.ds-model-config-modal');
        if (!modal) return;

        // Remove existing dialog if any
        const existingDialog = modal.querySelector('.ds-dialog-overlay');
        if (existingDialog) existingDialog.remove();

        const dialogOverlay = document.createElement('div');
        dialogOverlay.className = 'ds-dialog-overlay';

        dialogOverlay.innerHTML = `
            <div class="ds-dialog" style="width: 480px;">
                <h3>新增模型</h3>
                <div class="ds-form-group">
                    <label class="ds-form-label">供应商</label>
                    <select class="ds-form-input" id="ds-new-model-provider">
                        <option value="deepseek">DeepSeek</option>
                        <option value="volcengine">火山引擎</option>
                    </select>
                </div>
                <div class="ds-form-group">
                    <label class="ds-form-label">基础URL</label>
                    <input type="text" class="ds-form-input" id="ds-new-model-baseurl" value="https://api.deepseek.com" placeholder="https://api.deepseek.com">
                </div>
                <div class="ds-form-group">
                    <label class="ds-form-label">API密钥</label>
                    <input type="password" class="ds-form-input" id="ds-new-model-apikey" placeholder="输入API密钥">
                </div>
                <div class="ds-form-group">
                    <label class="ds-form-label">模型名称</label>
                    <input type="text" class="ds-form-input" id="ds-new-model-name" placeholder="deepseek-chat">
                </div>
                <div class="ds-form-group">
                    <label class="ds-form-label">显示名称</label>
                    <input type="text" class="ds-form-input" id="ds-new-model-displayname" placeholder="模型别名">
                </div>
                <div class="ds-form-group">
                    <label class="ds-form-label">
                        <input type="checkbox" id="ds-new-model-default"> 设为默认模型
                    </label>
                </div>
                <div id="ds-new-model-test-result"></div>
                <div class="ds-dialog-buttons">
                    <button class="ds-btn ds-btn-secondary" id="ds-new-model-cancel">取消</button>
                    <button class="ds-btn ds-btn-secondary" id="ds-new-model-test">测试连接</button>
                    <button class="ds-btn ds-btn-primary" id="ds-new-model-save" disabled>保存</button>
                </div>
            </div>
        `;

        modal.appendChild(dialogOverlay);

        const closeDialog = () => dialogOverlay.remove();
        const testResult = document.getElementById('ds-new-model-test-result');
        const saveBtn = document.getElementById('ds-new-model-save');
        let isTested = false; // 用于记录测试状态

        // 供应商选择事件
        document.getElementById('ds-new-model-provider').addEventListener('change', (e) => {
            const provider = e.target.value;
            const baseUrlInput = document.getElementById('ds-new-model-baseurl');
            if (provider === 'deepseek') {
                baseUrlInput.value = 'https://api.deepseek.com';
            } else if (provider === 'volcengine') {
                baseUrlInput.value = 'https://ark.cn-beijing.volces.com/api/v3';
            }
            // 重置测试状态
            isTested = false;
            saveBtn.disabled = true;
            testResult.innerHTML = '';
        });

        // 测试连接功能
        document.getElementById('ds-new-model-test').addEventListener('click', () => {
            const provider = document.getElementById('ds-new-model-provider').value;
            const baseUrl = document.getElementById('ds-new-model-baseurl').value.trim();
            const apiKey = document.getElementById('ds-new-model-apikey').value.trim();
            const modelName = document.getElementById('ds-new-model-name').value.trim();
            const displayName = document.getElementById('ds-new-model-displayname').value.trim();

            if (!baseUrl || !apiKey || !modelName || !displayName) {
                testResult.innerHTML = '<div class="ds-model-test-result error">请先填写所有必填字段</div>';
                isTested = false;
                saveBtn.disabled = true;
                return;
            }

            testResult.innerHTML = '<div class="ds-model-test-result">正在测试连接...</div>';
            saveBtn.disabled = true;

            // 调用测试函数
            this.testNewModelConnection({
                provider,
                baseUrl,
                apiKey,
                model: modelName,
                displayName
            }, (success, message) => {
                if (success) {
                    testResult.innerHTML = `<div class="ds-model-test-result success">✓ ${message || '连接测试成功'}</div>`;
                    isTested = true;
                    saveBtn.disabled = false;
                } else {
                    testResult.innerHTML = `<div class="ds-model-test-result error">✗ ${message || '连接测试失败，请检查配置'}</div>`;
                    isTested = false;
                    saveBtn.disabled = true;
                }
            });
        });

        document.getElementById('ds-new-model-cancel').addEventListener('click', closeDialog);
        document.getElementById('ds-new-model-save').addEventListener('click', () => {
            if (!isTested) {
                alert('请先测试连接，测试通过后才能保存！');
                return;
            }
            const provider = document.getElementById('ds-new-model-provider').value;
            const baseUrl = document.getElementById('ds-new-model-baseurl').value.trim();
            const apiKey = document.getElementById('ds-new-model-apikey').value.trim();
            const modelName = document.getElementById('ds-new-model-name').value.trim();
            const displayName = document.getElementById('ds-new-model-displayname').value.trim();
            const isDefault = document.getElementById('ds-new-model-default').checked;

            if (!baseUrl || !apiKey || !modelName || !displayName) {
                alert('请填写所有必填字段！');
                return;
            }

            // 如果设为默认，清除其他模型的默认状态
            if (isDefault) {
                this.state.models.forEach(m => m.isDefault = false);
            }

            const newModel = {
                id: 'model_' + Date.now(),
                provider,
                baseUrl,
                apiKey,
                model: modelName,
                displayName,
                isDefault,
                isTested: true
            };

            this.state.models.push(newModel);
            this.saveModels();
            this.renderModelList();
            closeDialog();
        });
    },

    // 真实API测试函数
    async testAPIConnection(modelConfig) {
        try {
            // 构建API端点URL
            let apiUrl = modelConfig.baseUrl.replace(/\/$/, ''); // 移除尾部斜杠
            if (modelConfig.provider === 'deepseek') {
                apiUrl += '/v1/chat/completions';
            } else if (modelConfig.provider === 'volcengine') {
                // 火山引擎的端点格式
                apiUrl += '/chat/completions';
            } else {
                // 默认使用标准格式
                apiUrl += '/v1/chat/completions';
            }

            // 构建请求体
            const requestBody = {
                model: modelConfig.model,
                messages: [
                    {
                        role: 'user',
                        content: 'test'
                    }
                ],
                max_tokens: 5, // 只请求5个token，快速测试
                temperature: 0.1
            };

            // 发送API请求
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${modelConfig.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            // 检查响应状态
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            // 验证响应格式
            const data = await response.json();
            if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
                return { success: true, message: '连接测试成功' };
            } else {
                throw new Error('响应格式不正确');
            }
        } catch (error) {
            // 处理不同类型的错误
            let errorMessage = '连接测试失败';
            if (error.name === 'TypeError' && error.message && error.message.includes('fetch')) {
                errorMessage += ': 网络请求失败，请检查URL和网络连接';
            } else if (error.name === 'SyntaxError') {
                errorMessage += ': 服务器响应格式错误';
            } else if (error.message) {
                errorMessage += ': ' + error.message;
            } else {
                errorMessage += ': 未知错误';
            }
            return { success: false, message: errorMessage };
        }
    },

    testModelConnection() {
        const model = this.state.models.find(m => m.id === this.state.activeModelId);
        if (!model) return;

        const testResult = document.getElementById('ds-model-test-result');
        testResult.innerHTML = '<div class="ds-model-test-result">正在测试连接...</div>';

        // 获取当前表单中的配置（可能正在编辑）
        const baseUrl = document.getElementById('ds-model-baseurl')?.value.trim() || model.baseUrl;
        const apiKey = document.getElementById('ds-model-apikey')?.value.trim() || model.apiKey;
        const modelName = document.getElementById('ds-model-name')?.value.trim() || model.model;

        if (!baseUrl || !apiKey || !modelName) {
            testResult.innerHTML = '<div class="ds-model-test-result error">请先填写所有必填字段</div>';
            return;
        }

        // 调用真实的API测试
        this.testAPIConnection({
            provider: model.provider,
            baseUrl: baseUrl,
            apiKey: apiKey,
            model: modelName
        }).then(result => {
            if (result.success) {
                testResult.innerHTML = `<div class="ds-model-test-result success">✓ ${result.message}</div>`;
                model.isTested = true;
            } else {
                testResult.innerHTML = `<div class="ds-model-test-result error">✗ ${result.message}</div>`;
                model.isTested = false;
            }
            this.saveModels();
        });
    },

    testNewModelConnection(modelConfig, callback) {
        // 调用真实的API测试
        this.testAPIConnection(modelConfig).then(result => {
            if (callback) {
                callback(result.success, result.message);
            }
        }).catch(error => {
            if (callback) {
                callback(false, error.message || '测试失败');
            }
        });
    },

    saveModelConfig() {
        const model = this.state.models.find(m => m.id === this.state.activeModelId);
        if (!model) return;

        const provider = document.getElementById('ds-model-provider').value;
        const baseUrl = document.getElementById('ds-model-baseurl').value.trim();
        const apiKey = document.getElementById('ds-model-apikey').value.trim();
        const modelName = document.getElementById('ds-model-name').value.trim();
        const displayName = document.getElementById('ds-model-displayname').value.trim();
        const isDefault = document.getElementById('ds-model-default').checked;

        if (!baseUrl || !apiKey || !modelName || !displayName) {
            alert('请填写所有必填字段！');
            return;
        }

        // 如果设为默认，清除其他模型的默认状态
        if (isDefault) {
            this.state.models.forEach(m => m.isDefault = false);
        }

        model.provider = provider;
        model.baseUrl = baseUrl;
        model.apiKey = apiKey;
        model.model = modelName;
        model.displayName = displayName;
        model.isDefault = isDefault;

        this.saveModels();
        
        // 保存后返回列表视图
        this.state.activeModelId = null;
        this.renderModelList();
        this.renderModelConfig();
        
        alert('模型配置已保存！');
    },

    insertPrompt(text) {
        let textarea = document.getElementById('chat-input');
        if (!textarea) {
            // Fallback: try to find the main textarea
            textarea = document.querySelector('textarea');
        }

        if (textarea) {
            const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeTextAreaValueSetter.call(textarea, text);
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.focus();
        } else {
             console.error('DeepSeek Prompt Extension: Could not find chat input textarea.');
        }
    }
};

// Initialize Prompt Manager
PromptManager.init();

// Function to inject the new button
function injectPromptButton() {
    // Check if our button already exists to avoid duplicates
    if (document.getElementById('deepseek-prompt-button')) {
        return;
    }

    const targetButton = findTargetButton();
    
    // If target button is not found yet, return
    if (!targetButton) {
        return;
    }

    console.log("DeepSeek Prompt Extension: Found target button, injecting new button...");

    // Clone the target button to inherit all styles and structure
    const newButton = targetButton.cloneNode(true);
    
    // Set a unique ID
    newButton.id = 'deepseek-prompt-button';
    
    // Remove the 'selected' class so it doesn't look active by default
    newButton.classList.remove('ds-toggle-button--selected');

    // Update the icon to a "Sparkles" icon (Prompt/Magic style)
    const svgElement = newButton.querySelector('svg');
    if (svgElement) {
        // Clear existing paths
        while (svgElement.firstChild) {
            svgElement.removeChild(svgElement.firstChild);
        }
        
        // Create new path for "Sparkles" icon
        const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        newPath.setAttribute('fill-rule', 'evenodd');
        newPath.setAttribute('clip-rule', 'evenodd');
        // Sparkles path (Main star + small star)
        newPath.setAttribute('d', 'M7 0.5C7.2 0.5 7.4 0.7 7.5 0.9L8.6 4.3L12 5.4C12.2 5.5 12.2 5.8 12 5.9L8.6 7L7.5 10.4C7.4 10.6 7.2 10.6 7 10.4L5.9 7L2.5 5.9C2.3 5.8 2.3 5.5 2.5 5.4L5.9 4.3L7 0.9C7.1 0.7 7.2 0.5 7 0.5ZM10.5 9.5C10.6 9.5 10.7 9.6 10.7 9.7L11.2 11.2L12.7 11.7C12.8 11.7 12.8 11.9 12.7 12L11.2 12.5L10.7 14C10.7 14.1 10.6 14.1 10.5 14C10.5 14.1 10.4 14.1 10.3 14L9.8 12.5L8.3 12C8.2 11.9 8.2 11.7 8.3 11.7L9.8 11.2L10.3 9.7C10.4 9.6 10.4 9.5 10.5 9.5Z');
        newPath.setAttribute('fill', 'currentColor');
        
        svgElement.appendChild(newPath);
    }
    
    // Update the text content
    const xpathText = ".//span[text()='联网搜索']";
    const textNode = document.evaluate(xpathText, newButton, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    
    if (textNode) {
        textNode.textContent = '提示词';
    } else {
        const spans = newButton.getElementsByTagName('span');
        if (spans.length > 0) {
             const walker = document.createTreeWalker(newButton, NodeFilter.SHOW_TEXT, null, false);
             let node;
             while(node = walker.nextNode()) {
                 if (node.nodeValue === '联网搜索') {
                     node.nodeValue = '提示词';
                     break;
                 }
             }
        }
    }
    
    // Add margin to separate it from the search button (in case parent doesn't use gap)
    newButton.style.marginLeft = '10px';

    // Add click event listener
    newButton.addEventListener('click', (e) => {
        // Prevent default behavior and propagation
        e.preventDefault();
        e.stopPropagation();
        
        // Open the Prompt Manager
        PromptManager.toggle();
    });

    // Insert the new button after the target button
    if (targetButton.parentElement) {
        targetButton.parentElement.insertBefore(newButton, targetButton.nextSibling);
    }
}

// Observer to handle dynamic loading (SPA)
const observer = new MutationObserver((mutations) => {
    injectPromptButton();
});

// Start observing the body for changes
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial check
injectPromptButton();
