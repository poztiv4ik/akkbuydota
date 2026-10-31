const favoritesStorageKey = 'akkbuydota2.favoriteAccounts';
const favoritesContainer = document.getElementById('accountsContainer');

function readFavoriteIds() {
	try {
		const savedIds = JSON.parse(localStorage.getItem(favoritesStorageKey) || '[]');
		return new Set(Array.isArray(savedIds) ? savedIds.filter(Number.isInteger) : []);
	} catch (error) {
		return new Set();
	}
}

const favoriteAccountIds = readFavoriteIds();

function updateFavoriteButton(button) {
	const isFavorite = favoriteAccountIds.has(Number(button.dataset.accountId));
	const label = isFavorite ? 'Видалити з обраного' : 'Додати в обране';

	button.classList.toggle('is-favorite', isFavorite);
	button.setAttribute('aria-pressed', String(isFavorite));
	button.setAttribute('aria-label', label);
	button.title = label;
	button.querySelector('i').className = isFavorite
		? 'fa-solid fa-bookmark'
		: 'fa-regular fa-bookmark';
}

function refreshFavoriteButtons() {
	favoritesContainer.querySelectorAll('.card-fav[data-account-id]').forEach(updateFavoriteButton);
}

favoritesContainer.addEventListener('click', event => {
	const button = event.target.closest('.card-fav[data-account-id]');
	if (!button) return;

	const accountId = Number(button.dataset.accountId);
	if (favoriteAccountIds.has(accountId)) {
		favoriteAccountIds.delete(accountId);
	} else {
		favoriteAccountIds.add(accountId);
	}

	try {
		localStorage.setItem(favoritesStorageKey, JSON.stringify([...favoriteAccountIds]));
	} catch (error) {
		const message = document.getElementById('catalogMessage');
		message.textContent = 'Не вдалося зберегти обране у цьому браузері.';
		message.classList.add('is-error');
	}

	updateFavoriteButton(button);
});

new MutationObserver(refreshFavoriteButtons).observe(favoritesContainer, {
	childList: true
});

refreshFavoriteButtons();
