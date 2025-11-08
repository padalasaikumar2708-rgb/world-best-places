// data for 5 places (replace image paths with your own in images/)
const places = [
  // 🌏 ASIA
  { id: 1, title: "Taj Mahal", country: "India", img: "images/tajmahal.jpg", coords: "27.175015,78.042155", desc: "Marble mausoleum in Agra, symbol of love." },
  { id: 2, title: "Great Wall of China", country: "China", img: "images/great wall of china.jpg", coords: "40.431908,116.570374", desc: "Ancient defensive wall spanning northern China." },
  { id: 3, title: "Mount Fuji", country: "Japan", img: "images/mount fuji.jpg", coords: "35.360555,138.727778", desc: "Sacred mountain and Japan’s highest peak." },
 
  // 🌍 EUROPE
  { id: 4, title: "Eiffel Tower", country: "France", img: "images/eiffel.jpg", coords: "48.858370,2.294481", desc: "Paris icon and world-famous landmark." },
  { id: 5, title: "Colosseum", country: "Italy", img: "images/colosseum.jpg", coords: "41.890210,12.492231", desc: "Ancient Roman amphitheatre in the heart of Rome." },
  { id: 6, title: "Big Ben", country: "United Kingdom", img: "images/big ben.jpg", coords: "51.500729,-0.124625", desc: "Clock tower on the Palace of Westminster." },

  // 🌎 NORTH AMERICA
  { id: 7, title: "Statue of Liberty", country: "United States", img: "images/Statue of Liberty.jpg", coords: "40.689247,-74.044502", desc: "Symbol of freedom in New York Harbor." },
  { id: 8, title: "Chichén Itzá", country: "Mexico", img: "images/Chichén Itzá.jpg", coords: "20.684285,-88.567783", desc: "Ancient Mayan city and pyramid temple." },

  // 🌎 SOUTH AMERICA
  { id: 9, title: "Christ the Redeemer", country: "Brazil", img: "images/Christ the Redeemer.jpg", coords: "-22.951916,-43.210487", desc: "Statue overlooking Rio de Janeiro." },
  { id: 10, title: "Machu Picchu", country: "Peru", img: "images/Machu Picchu.jpg", coords: "-13.163141,-72.544963", desc: "Incan citadel in the Andes Mountains." },
 
  // 🌍 AFRICA
  { id: 11, title: "Pyramids of Giza", country: "Egypt", img: "images/Pyramids of Giza.jpg", coords: "29.979235,31.134202", desc: "Ancient pyramids near Cairo." },
  { id: 12, title: "Table Mountain", country: "South Africa", img: "images/Table Mountain.jpg", coords: "-33.962822,18.409809", desc: "Flat-topped mountain overlooking Cape Town." },

  // 🌏 OCEANIA
  { id: 13, title: "Sydney Opera House", country: "Australia", img: "images/Sydney Opera House.jpg", coords: "-33.856784,151.215297", desc: "Iconic performing-arts center on Sydney Harbour." },
  { id: 14, title: "Milford Sound", country: "New Zealand", img: "images/Milford Sound.jpg", coords: "-44.670590,167.924561", desc: "Spectacular fjord known for cliffs and waterfalls." }
];



// --- DOM refs ---
const gallery = document.getElementById('gallery');
const countryFilter = document.getElementById('countryFilter');
const searchInput = document.getElementById('search');

const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalCountry = document.getElementById('modalCountry');
const mapLink = document.getElementById('mapLink');
const favBtn = document.getElementById('favBtn');

let favorites = new Set(JSON.parse(localStorage.getItem('wex_favs')||'[]'));

// render country options
function populateCountries(){
  const countries = [...new Set(places.map(p=>p.country))].sort();
  countries.forEach(c=>{
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    countryFilter.appendChild(opt);
  });
}

// render cards
function renderCards(filterText='', filterCountry=''){
  gallery.innerHTML='';
  const q = filterText.trim().toLowerCase();
  const results = places.filter(p=>{
    const matchText = p.title.toLowerCase().includes(q) || p.country.toLowerCase().includes(q);
    const matchCountry = filterCountry ? p.country === filterCountry : true;
    return matchText && matchCountry;
  });
  if(results.length === 0){
    gallery.innerHTML = '<p style="padding:24px;color:#555">No places found.</p>';
    return;
  }
  results.forEach(p=>{
    const card = document.createElement('article');
    card.className='card';
    card.innerHTML = `
      <img loading="lazy" src="${p.img}" alt="${p.title}" />
      <div class="card-body">
        <h3>${p.title}</h3>
        <p>${p.desc.slice(0,90)}${p.desc.length>90?'…':''}</p>
        <div class="meta">
          <small>${p.country}</small>
          <div>
            <button class="view" data-id="${p.id}">View</button>
            <button class="fav" data-id="${p.id}">${favorites.has(p.id) ? '★' : '☆'}</button>
          </div>
        </div>
      </div>
    `;
    gallery.appendChild(card);
  });
  // attach listeners
  document.querySelectorAll('.view').forEach(btn=>{
    btn.addEventListener('click', ()=> openModal(places.find(x=>x.id==btn.dataset.id)));
  });
  document.querySelectorAll('.fav').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = Number(btn.dataset.id);
      if(favorites.has(id)) favorites.delete(id); else favorites.add(id);
      localStorage.setItem('wex_favs', JSON.stringify([...favorites]));
      renderCards(searchInput.value, countryFilter.value);
    });
  });
}

// modal open
function openModal(place){
  modalImg.src = place.img;
  modalTitle.textContent = place.title;
  modalDesc.textContent = place.desc;
  modalCountry.textContent = place.country;
  mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.coords)}`;
  favBtn.textContent = favorites.has(place.id) ? 'Remove from favorites' : 'Add to favorites';
  favBtn.onclick = ()=>{
    if(favorites.has(place.id)) favorites.delete(place.id); else favorites.add(place.id);
    localStorage.setItem('wex_favs', JSON.stringify([...favorites]));
    favBtn.textContent = favorites.has(place.id) ? 'Remove from favorites' : 'Add to favorites';
    renderCards(searchInput.value, countryFilter.value);
  };
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden','false');
}

// modal close
closeModal.addEventListener('click', ()=>{ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); });

// search & filter events
searchInput.addEventListener('input', ()=> renderCards(searchInput.value, countryFilter.value));
countryFilter.addEventListener('change', ()=> renderCards(searchInput.value, countryFilter.value));

// init
populateCountries();
renderCards();
