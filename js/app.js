document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Elements ---
    const homePage = document.getElementById('home-page');
    const categoryPage = document.getElementById('category-page');
    const navToCategoryBtn = document.getElementById('nav-to-category-btn');
    const navToHomeBtn = document.getElementById('nav-to-home-btn');

    // --- Home Form Elements ---
    const addExpenseForm = document.getElementById('add-expense-form');
    const expenseTitle = document.getElementById('expense-title');
    const expenseAmount = document.getElementById('expense-amount');
    const expenseCategory = document.getElementById('expense-category');

    // Date button & picker elements
    const expenseDateBtn = document.getElementById('expense-date-btn');
    const expenseDate = document.getElementById('expense-date');
    const expenseDateDisplay = document.getElementById('expense-date-display');

    // Home Displays
    const totalSpendingsAmount = document.getElementById('total-spendings-amount');
    const recentExpensesList = document.getElementById('recent-expenses-list');

    // --- Category Page Elements ---
    const expenseSearch = document.getElementById('expense-search');
    const categoryFilter = document.getElementById('category-filter');
    const categoryExpenseTbody = document.getElementById('category-expense-tbody');
    const noCategoryData = document.getElementById('no-category-data');

    // --- Edit Modal Elements ---
    const editModal = document.getElementById('edit-modal');
    const editExpenseForm = document.getElementById('edit-expense-form');
    const editExpenseId = document.getElementById('edit-expense-id');
    const editExpenseTitle = document.getElementById('edit-expense-title');
    const editExpenseAmount = document.getElementById('edit-expense-amount');
    const editExpenseCategory = document.getElementById('edit-expense-category');
    const editDateBtn = document.getElementById('edit-date-btn');
    const editExpenseDate = document.getElementById('edit-expense-date');
    const editDateDisplay = document.getElementById('edit-date-display');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');

    // --- Delete Confirmation Modal Elements ---
    const deleteModal = document.getElementById('delete-modal');
    const deleteItemName = document.getElementById('delete-item-name');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    let pendingDeleteData = null; // holds { id, title, category }

    // --- Toast Containers ---
    const toastTopRightContainer = document.getElementById('toast-top-right-container');
    const toastCenterContainer = document.getElementById('toast-center-container');

    // ==========================================================================
    // NAVIGATION
    // ==========================================================================
    navToCategoryBtn.addEventListener('click', () => {
        homePage.classList.remove('active');
        categoryPage.classList.add('active');
        renderCategoryPage();
    });

    navToHomeBtn.addEventListener('click', () => {
        categoryPage.classList.remove('active');
        homePage.classList.add('active');
        renderHomePage();
    });

    // ==========================================================================
    // DATE BUTTON INTERACTIONS
    // ==========================================================================
    function setupDatePicker(triggerBtn, dateInput, displaySpan) {
        triggerBtn.addEventListener('click', () => {
            if (typeof dateInput.showPicker === 'function') {
                dateInput.showPicker();
            } else {
                dateInput.focus();
            }
        });

        dateInput.addEventListener('change', () => {
            if (dateInput.value) {
                displaySpan.textContent = dateInput.value;
            } else {
                displaySpan.textContent = "Choose Date";
            }
        });
    }

    setupDatePicker(expenseDateBtn, expenseDate, expenseDateDisplay);
    setupDatePicker(editDateBtn, editExpenseDate, editDateDisplay);

    // ==========================================================================
    // TOAST NOTIFICATIONS
    // ==========================================================================
    let activeTopRightToast = null;
    let topRightTimeout = null;

    function showTopRightToast(message, type = 'error') {
        if (activeTopRightToast) {
            activeTopRightToast.classList.remove('toast-shake');
            void activeTopRightToast.offsetWidth;
            activeTopRightToast.classList.add('toast-shake');
            activeTopRightToast.querySelector('.toast-msg').textContent = message;

            clearTimeout(topRightTimeout);
            topRightTimeout = setTimeout(() => dismissTopRightToast(), 2500);
            return;
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type === 'error' ? 'error' : 'info'} toast-slide-in`;
        const icon = type === 'error' ? 'fa-circle-exclamation' : 'fa-trash';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span class="toast-msg">${message}</span>`;

        toastTopRightContainer.appendChild(toast);
        activeTopRightToast = toast;

        topRightTimeout = setTimeout(() => dismissTopRightToast(), 2500);
    }

    function dismissTopRightToast() {
        if (activeTopRightToast) {
            activeTopRightToast.remove();
            activeTopRightToast = null;
            clearTimeout(topRightTimeout);
        }
    }

    let activeCenterToast = null;
    let centerToastTimeout = null;

    function showCenterFadeToast(message, duration = 3000) {
        if (activeCenterToast) {
            activeCenterToast.remove();
            clearTimeout(centerToastTimeout);
            activeCenterToast = null;
        }

        const toast = document.createElement('div');
        toast.className = 'toast toast-success-center fade-out';
        toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
        toastCenterContainer.appendChild(toast);
        activeCenterToast = toast;

        centerToastTimeout = setTimeout(() => {
            if (activeCenterToast === toast) {
                toast.remove();
                activeCenterToast = null;
            }
        }, duration);
    }

    // ==========================================================================
    // HOME PAGE: ADD EXPENSE FORM (POST via API)
    // ==========================================================================
    addExpenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const titleVal = expenseTitle.value.trim();
        const amountVal = expenseAmount.value.trim();
        const categoryVal = expenseCategory.value;
        const dateVal = expenseDate.value;

        if (!titleVal) {
            showTopRightToast("Title field is required");
            return;
        }
        if (!amountVal || isNaN(amountVal) || Number(amountVal) <= 0) {
            showTopRightToast("Valid Amount is required");
            return;
        }
        if (!categoryVal) {
            showTopRightToast("Category option is required");
            return;
        }
        if (!dateVal) {
            showTopRightToast("Expense Date is required");
            return;
        }

        try {
            await ExpenseAPI.create({
                title: titleVal,
                amount: parseFloat(amountVal),
                category: categoryVal,
                date: dateVal
            });

            // Clear input fields & reset picker label
            addExpenseForm.reset();
            expenseDateDisplay.textContent = "Choose Date";

            showCenterFadeToast("Expense Added Successfully!");
            renderHomePage();
        } catch (err) {
            showTopRightToast("Failed to save to JSON server.");
        }
    });

    // ==========================================================================
    // RENDER HOME PAGE (GET via API)
    // ==========================================================================
    async function renderHomePage() {
        try {
            const response = await ExpenseAPI.getAll();
            const expenses = response.data;

            // 1. Calculate & display Total Spendings
            const total = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
            totalSpendingsAmount.textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            // 2. Sort by creation time (most recently added first)
            const sortedByRecent = [...expenses].sort((a, b) => b.createdAt - a.createdAt);

            recentExpensesList.innerHTML = '';
            if (sortedByRecent.length === 0) {
                recentExpensesList.innerHTML = `<p class="empty-state">No recent expenses recorded.</p>`;
                return;
            }

            sortedByRecent.forEach(item => {
                const card = document.createElement('div');
                card.className = 'expense-item-card';
                card.innerHTML = `
          <div class="expense-item-info">
            <span class="item-title">${escapeHtml(item.title)}</span>
            <span class="item-meta">
              <span><i class="fa-solid fa-tag"></i> ${escapeHtml(item.category)}</span>
              <span><i class="fa-regular fa-calendar"></i> ${item.date}</span>
            </span>
          </div>
          <div class="item-amount">₹${Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        `;
                recentExpensesList.appendChild(card);
            });
        } catch (err) {
            recentExpensesList.innerHTML = `<p class="empty-state">Unable to load data. Is json-server running?</p>`;
        }
    }

    // ==========================================================================
    // CATEGORY & SEARCH PAGE RENDERING (GET via API)
    // ==========================================================================
    categoryFilter.addEventListener('change', renderCategoryPage);
    expenseSearch.addEventListener('input', renderCategoryPage);

    async function renderCategoryPage() {
        try {
            const response = await ExpenseAPI.getAll();
            let expenses = response.data;

            // Filter by Category
            const selectedCategory = categoryFilter.value;
            if (selectedCategory !== 'ALL') {
                expenses = expenses.filter(exp => exp.category === selectedCategory);
            }

            // Filter by Search Query
            const searchQuery = expenseSearch.value.trim().toLowerCase();
            if (searchQuery) {
                expenses = expenses.filter(exp => exp.title.toLowerCase().includes(searchQuery));
            }

            // Sort chronologically by expense date
            expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

            categoryExpenseTbody.innerHTML = '';

            if (expenses.length === 0) {
                noCategoryData.classList.remove('hidden');
            } else {
                noCategoryData.classList.add('hidden');
                expenses.forEach(item => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
            <td>${item.date}</td>
            <td><strong>${escapeHtml(item.title)}</strong></td>
            <td><span class="badge badge-cat">${escapeHtml(item.category)}</span></td>
            <td>₹${Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td class="actions-col">
              <div class="action-buttons">
                <button class="btn btn-sm btn-edit" data-id="${item.id}">
                  <i class="fa-solid fa-pencil"></i> Edit
                </button>
                <button class="btn btn-sm btn-delete" 
                        data-id="${item.id}" 
                        data-title="${escapeHtml(item.title)}" 
                        data-category="${escapeHtml(item.category)}">
                  <i class="fa-solid fa-trash"></i> Delete
                </button>
              </div>
            </td>
          `;
                    categoryExpenseTbody.appendChild(tr);
                });
            }

            attachActionListeners();
        } catch (err) {
            showTopRightToast("Failed to fetch expenses from server.");
        }
    }

    // ==========================================================================
    // EDIT & DELETE ACTIONS (PUT & DELETE via API)
    // ==========================================================================
    function attachActionListeners() {
        // Delete Button triggers confirmation dialog
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                pendingDeleteData = {
                    id: btn.getAttribute('data-id'),
                    title: btn.getAttribute('data-title'),
                    category: btn.getAttribute('data-category')
                };
                deleteItemName.textContent = `"${pendingDeleteData.title}" (${pendingDeleteData.category})`;
                deleteModal.classList.remove('hidden');
            });
        });

        // Edit Button opens in-page edit modal
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const response = await ExpenseAPI.getAll();
                const expense = response.data.find(e => String(e.id) === String(id));

                if (expense) {
                    editExpenseId.value = expense.id;
                    editExpenseTitle.value = expense.title;
                    editExpenseAmount.value = expense.amount;
                    editExpenseCategory.value = expense.category;
                    editExpenseDate.value = expense.date;
                    editDateDisplay.textContent = expense.date;

                    editModal.classList.remove('hidden');
                }
            });
        });
    }

    // Confirm DELETE API Request
    confirmDeleteBtn.addEventListener('click', async () => {
        if (!pendingDeleteData) return;

        try {
            await ExpenseAPI.delete(pendingDeleteData.id);
            showTopRightToast(`Deleted: "${pendingDeleteData.title}" (${pendingDeleteData.category})`, 'info');
            deleteModal.classList.add('hidden');
            pendingDeleteData = null;
            renderCategoryPage();
        } catch (err) {
            showTopRightToast("Error deleting item from API.");
        }
    });

    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.classList.add('hidden');
        pendingDeleteData = null;
    });

    // Submit PUT API Request
    editExpenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = editExpenseId.value;
        const title = editExpenseTitle.value.trim();
        const amount = editExpenseAmount.value.trim();
        const category = editExpenseCategory.value;
        const date = editExpenseDate.value;

        if (!title || !amount || !category || !date) {
            showTopRightToast("All fields are required to update.");
            return;
        }

        try {
            await ExpenseAPI.update(id, {
                title,
                amount: parseFloat(amount),
                category,
                date
            });

            editModal.classList.add('hidden');
            showCenterFadeToast("Expense Updated Successfully!");
            renderCategoryPage();
        } catch (err) {
            showTopRightToast("Failed to update expense on JSON server.");
        }
    });

    closeModalBtn.addEventListener('click', () => editModal.classList.add('hidden'));
    cancelEditBtn.addEventListener('click', () => editModal.classList.add('hidden'));

    function escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }

    // Load Home data from API on start
    renderHomePage();
});