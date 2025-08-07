document.addEventListener('DOMContentLoaded', function() {
    // Dados de exemplo - na aplicação real, isso viria de um banco de dados
    const clothingDatabase = [
        { id: 1, name: "Cropped Branco", category: "top", image: "imagens/cropped-branco.jpg" },
        { id: 2, name: "Calça Jeans Skinny", category: "bottom", image: "imagens/calca-jeans.jpg" },
        { id: 3, name: "Tênis Branco", category: "shoes", image: "imagens/tenis-branco.jpg" },
        { id: 4, name: "Blusa Preta", category: "top", image: "imagens/blusa-preta.jpg" },
        { id: 5, name: "Short Jeans", category: "bottom", image: "imagens/short-jeans.jpg" },
        { id: 6, name: "Tênis Preto", category: "shoes", image: "imagens/tenis-preto.jpg" },
        { id: 7, name: "Vestido Floral", category: "dress", image: "imagens/vestido-floral.jpg" },
        { id: 8, name: "Cropped Listrado", category: "top", image: "imagens/cropped-listrado.jpg" },
        { id: 9, name: "Calça Cargo", category: "bottom", image: "imagens/calca-cargo.jpg" },
        { id: 10, name: "Tênis Esportivo", category: "shoes", image: "imagens/tenis-esportivo.jpg" }
    ];

    // Elementos DOM
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchResults = document.getElementById('search-results');
    const recommendations = document.getElementById('recommendations');
    const wardrobeItems = document.getElementById('wardrobe-items');
    const generateLookBtn = document.getElementById('generate-look-btn');
    const generatedLook = document.getElementById('generated-look');
    const categoryBtns = document.querySelectorAll('.category-btn');

    // Estado da aplicação
    let wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || [];
    let currentCategory = 'all';

    // Inicialização
    displayRecommendations();
    updateWardrobeDisplay();

    // Event Listeners
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });

    generateLookBtn.addEventListener('click', generateRandomLook);

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            performSearch();
        });
    });

    // Funções
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        
        let filteredItems = clothingDatabase.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
        );

        if (currentCategory !== 'all') {
            filteredItems = filteredItems.filter(item => item.category === currentCategory);
        }

        displaySearchResults(filteredItems);
    }

    function displaySearchResults(items) {
        searchResults.innerHTML = '';

        if (items.length === 0) {
            searchResults.innerHTML = '<p class="no-results">Nenhum item encontrado.</p>';
            return;
        }

        items.forEach(item => {
            const isInWardrobe = wardrobe.some(wardrobeItem => wardrobeItem.id === item.id);
            
            const itemElement = document.createElement('div');
            itemElement.className = 'clothing-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="clothing-info">
                    <h3>${item.name}</h3>
                    <p>${getCategoryName(item.category)}</p>
                    <button class="add-to-wardrobe" data-id="${item.id}" ${isInWardrobe ? 'disabled' : ''}>
                        ${isInWardrobe ? 'Adicionado' : 'Adicionar ao Guarda-Roupa'}
                    </button>
                </div>
            `;

            searchResults.appendChild(itemElement);
        });

        // Adiciona event listeners aos botões
        document.querySelectorAll('.add-to-wardrobe').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.dataset.id);
                addToWardrobe(itemId);
                this.disabled = true;
                this.textContent = 'Adicionado';
            });
        });
    }

    function displayRecommendations() {
        // Recomenda itens que combinam com itens já no guarda-roupa
        // Esta é uma implementação simples - pode ser melhorada com um sistema de recomendação mais sofisticado
        
        let recommendedItems = [];
        
        if (wardrobe.length > 0) {
            // Se houver itens no guarda-roupa, recomenda itens da mesma categoria ou que combinem
            const wardrobeCategories = wardrobe.map(item => item.category);
            
            recommendedItems = clothingDatabase.filter(item => {
                return !wardrobe.some(wardrobeItem => wardrobeItem.id === item.id) && 
                       wardrobeCategories.includes(item.category);
            }).slice(0, 6);
        } else {
            // Se o guarda-roupa estiver vazio, mostra itens populares
            recommendedItems = clothingDatabase.slice(0, 6);
        }
        
        recommendations.innerHTML = '';

        recommendedItems.forEach(item => {
            const isInWardrobe = wardrobe.some(wardrobeItem => wardrobeItem.id === item.id);
            
            const itemElement = document.createElement('div');
            itemElement.className = 'clothing-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="clothing-info">
                    <h3>${item.name}</h3>
                    <p>${getCategoryName(item.category)}</p>
                    <button class="add-to-wardrobe" data-id="${item.id}" ${isInWardrobe ? 'disabled' : ''}>
                        ${isInWardrobe ? 'Adicionado' : 'Adicionar ao Guarda-Roupa'}
                    </button>
                </div>
            `;

            recommendations.appendChild(itemElement);
        });

        // Adiciona event listeners aos botões
        document.querySelectorAll('.add-to-wardrobe').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.dataset.id);
                addToWardrobe(itemId);
                this.disabled = true;
                this.textContent = 'Adicionado';
            });
        });
    }

    function addToWardrobe(itemId) {
        const itemToAdd = clothingDatabase.find(item => item.id === itemId);
        if (itemToAdd && !wardrobe.some(item => item.id === itemId)) {
            wardrobe.push(itemToAdd);
            localStorage.setItem('wardrobe', JSON.stringify(wardrobe));
            updateWardrobeDisplay();
            displayRecommendations();
        }
    }

    function updateWardrobeDisplay() {
        if (wardrobe.length === 0) {
            wardrobeItems.innerHTML = `
                <div class="empty-wardrobe">
                    <i class="fas fa-tshirt"></i>
                    <p>Seu guarda-roupa está vazio</p>
                    <p>Adicione itens para montar seus looks</p>
                </div>
            `;
            return;
        }

        wardrobeItems.innerHTML = '<div class="wardrobe-items"></div>';
        const wardrobeContainer = document.querySelector('.wardrobe-items');

        wardrobe.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'wardrobe-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <button class="remove-item" data-id="${item.id}">&times;</button>
            `;
            wardrobeContainer.appendChild(itemElement);
        });

        // Adiciona event listeners aos botões de remover
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.dataset.id);
                removeFromWardrobe(itemId);
            });
        });
    }

    function removeFromWardrobe(itemId) {
        wardrobe = wardrobe.filter(item => item.id !== itemId);
        localStorage.setItem('wardrobe', JSON.stringify(wardrobe));
        updateWardrobeDisplay();
        displayRecommendations();
        
        // Atualiza os botões "Adicionar" nos resultados de pesquisa e recomendações
        document.querySelectorAll(`.add-to-wardrobe[data-id="${itemId}"]`).forEach(btn => {
            btn.disabled = false;
            btn.textContent = 'Adicionar ao Guarda-Roupa';
        });
    }

    function generateRandomLook() {
        if (wardrobe.length < 3) {
            alert('Adicione pelo menos 3 itens ao seu guarda-roupa para gerar um look.');
            return;
        }

        // Seleciona aleatoriamente 1 item de cada categoria disponível
        const tops = wardrobe.filter(item => item.category === 'top');
        const bottoms = wardrobe.filter(item => item.category === 'bottom');
        const shoes = wardrobe.filter(item => item.category === 'shoes');
        const dresses = wardrobe.filter(item => item.category === 'dress');

        let lookItems = [];

        // Se houver vestidos, pode usar apenas o vestido + sapatos
        if (dresses.length > 0 && Math.random() > 0.5) {
            lookItems.push(getRandomItem(dresses));
            if (shoes.length > 0) {
                lookItems.push(getRandomItem(shoes));
            }
        } else {
            // Caso contrário, usa combinação top + bottom + shoes
            if (tops.length > 0) lookItems.push(getRandomItem(tops));
            if (bottoms.length > 0) lookItems.push(getRandomItem(bottoms));
            if (shoes.length > 0) lookItems.push(getRandomItem(shoes));
        }

        // Exibe o look gerado
        generatedLook.innerHTML = '';
        lookItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'clothing-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="clothing-info">
                    <h3>${item.name}</h3>
                    <p>${getCategoryName(item.category)}</p>
                </div>
            `;
            generatedLook.appendChild(itemElement);
        });
    }

    function getRandomItem(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

    function getCategoryName(category) {
        const categories = {
            'top': 'Blusa',
            'bottom': 'Calça/Short',
            'shoes': 'Calçados',
            'dress': 'Vestido',
            'accessories': 'Acessórios'
        };
        return categories[category] || category;
    }
});
