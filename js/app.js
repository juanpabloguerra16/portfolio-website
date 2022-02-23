(function(app) {

    app.portfolioItems = []; // in memory objects
    app.selectedItem = {};

    app.homepage = function() {
        setCopyrightDate();
        wireContactForm();
    }

    app.portfolio = async function() {
        setCopyrightDate();
        await loadPageData();
        loadNavMenu();

        loadPortfolioPageData();
    }

    app.workItem = async function() {
        setCopyrightDate();
        await loadPageData();
        loadNavMenu();
        loadSpecificItem();
        updateItemPage();
    }

    function setCopyrightDate() {
        const date = new Date();
        document.getElementById('copyrightYear').innerText = date.getFullYear();
    }

    function wireContactForm() {
        const contactForm = document.getElementById('contact-form');
        contactForm.onsubmit = contactFormSubmit;
    }

    function contactFormSubmit(e) {
        e.preventDefault();
        const contactForm = document.getElementById('contact-form');
        const name = contactForm.querySelector('#name');
        const email = contactForm.querySelector('#email');
        const message = contactForm.querySelector('#message');

        const mailTo = `mailto:${email.value}?subject=Contact From ${name.value}&body=${message.value}`;
        window.open(mailTo);

        email.value = '';
        name.value = '';
        message.value = '';
    }

    async function loadPageData(){
        const cacheData = sessionStorage.getItem('site-data');
        if(cacheData !== null){
            app.portfolioItems = JSON.parse(cacheData);
        } else {
            const rawData = await fetch("sitedata.json")
            const data = await rawData.json();
            app.portfolioItems = data;
            sessionStorage.setItem('site-data', JSON.stringify(data));
        }
    }

    function loadSpecificItem () {
        // will pickup query string from a URL. e.g https://jpguerra.com?course=1&test=No$20Way
        // in our case we need to pick up the item={number} from the query parameters
        const params = new URLSearchParams(window.location.search);
        // '1' !== 1 therefore we parseInt
        let item = Number.parseInt(params.get('item'));

        if(item > app.portfolioItems.length || item < 1) {
            // our items: 1-3
            // our array IDs should be 0-2
            // our array length should be 3
            // assign a valid value to redirect to a not found page
            item = 1;
        }
        app.selectedItem = app.portfolioItems[item - 1];
        app.selectedItem.id = item;    
    }

    function updateItemPage() {
        const header = document.getElementById('work-item-header');
        header.innerText = `0${app.selectedItem.id}. ${app.selectedItem.title}`;

        const image = document.getElementById('work-item-image');
        image.src = app.selectedItem.largeImage;
        image.alt = app.selectedItem.largeImageAlt;

        const projectText = document.querySelector('#project-text p');
        projectText.innerText = app.selectedItem.projectText;

        const originalTechList = document.querySelector('#technologies-text ul');
        const technologySection = document.getElementById('technologies-text');
        const ul = document.createElement('ul');

        app.selectedItem.technologies.forEach(el => {
            const li = document.createElement('li');
            li.innerHTML = el;
            
            ul.appendChild(li);
        });

        originalTechList.remove();
        technologySection.append(ul);

        const challengesText = document.querySelector('#challenges-text p');
        challengesText.innerText = app.selectedItem.challengesText;

    }

    function loadPortfolioPageData(){
        // pull data from JSON dynamically to portofolio.html
        const originalItem = document.querySelectorAll('.highlight');
        const main = document.getElementById('portfolio-main');

        const newItems = []; //array will be used to store new divs and then push them to main

        for (let i = 0; i < app.portfolioItems.length; i++) {
            const el = app.portfolioItems[i];
            //create first div with class highlight
            const highlight = document.createElement('div');
            highlight.classList.add('highlight');
            //addressing inverted div
            if (i % 2 > 0){
                highlight.classList.add('invert');
            }
            //create second div
            const textDiv = document.createElement('div');
            const h2 = document.createElement('h2');
            const a = document.createElement('a');

            const titleWords = el.title.split(' '); // manipulate title to split in three lines
            
            let title = `0${i+1}. `;
            // 3 items - 0,1,3 'kids sports website', length =3
            for (let j = 0; j < titleWords.length - 1; j++) {
                title += titleWords[j];
                title += '<br />';
            }
            title += titleWords[titleWords.length - 1];

            h2.innerHTML = title;
            a.href = `workitem.html?item=${i+1}`;
            a.innerText = 'see more';

            textDiv.appendChild(h2);
            textDiv.appendChild(a);

            highlight.appendChild(textDiv);

            const img = document.createElement('img');
            img.src = el.smallImage;
            img.alt = el.smallImageAlt; 
            highlight.appendChild(img);
            newItems.push(highlight);
        }

        originalItem.forEach(el => el.remove());
        newItems.forEach(el => main.appendChild(el));

    }

    function loadNavMenu(){
        const originalNav = document.querySelectorAll('.work-item-nav');
        const nav = document.querySelector('nav ul');

        originalNav.forEach(el => el.remove());
        
        for (let i = 0; i < app.portfolioItems.length; i++) {     
            const li = document.createElement('li');
            li.classList.add('work-item-nav');
            const a = document.createElement('a');

            a.innerText = `Item #${i+1}`
            a.href = `workitem.html?item=${i+1}`;
            li.appendChild(a);
            nav.appendChild(li);           
        }
    }

})(window.app = window.app || {});