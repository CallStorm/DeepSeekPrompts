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
        }
        .ds-dark .ds-prompt-main-header {
            border-color: #333;
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
        categories: [] // Combined premade + custom
    },

    init() {
        injectStyles();
        this.loadCustomCategories();
        // Listen for storage changes
        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (namespace === 'local' && changes.customCategories) {
                this.loadCustomCategories();
            }
        });
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
                </div>
                <div class="ds-prompt-main">
                    <div class="ds-prompt-main-header">
                        <input type="text" class="ds-prompt-search" placeholder="搜索提示词..." id="ds-prompt-search-input">
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
        if (!contentArea) return;

        contentArea.innerHTML = '';
        
        const activeCategory = this.state.categories.find(c => c.id === this.state.activeCategoryId);
        if (!activeCategory) return;

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

        prompts.forEach(prompt => {
            const card = document.createElement('div');
            card.className = 'ds-prompt-card';
            card.innerHTML = `
                <div class="ds-prompt-card-title">${prompt.title}</div>
                <div class="ds-prompt-card-preview">${prompt.content}</div>
            `;
            
            card.addEventListener('click', () => {
                this.insertPrompt(prompt.content);
                this.close();
            });

            grid.appendChild(card);
        });

        contentArea.appendChild(grid);
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
