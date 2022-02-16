//******************************************* GLOBAL*****************************

let filmes = [];
const space = (168+24)*5;
let sliderIndex = 0;
const   conteiner = document.querySelector(".movies"),
        pesquisa  = document.querySelector(".input"),
        modal     = document.querySelector(".modal");
let cards;


function slide(){

    sliderIndex = (sliderIndex+1)%(Math.round( cards.length/5 ));
    cards.forEach((card)=>{
        card.style.transform = `translate(${sliderIndex*-space}px,0)`;
    })
}


function InvSlide(){
    
    sliderIndex--;
    if( sliderIndex < 0){
        sliderIndex = Math.round( cards.length/5 )-1;
    }

    cards.forEach((card)=>{
        card.style.transform = `translate(${sliderIndex*-space}px,0)`;
    })
}

const pega = async (search)=>{
    conteiner.innerHTML = "";
    let link;
    if(search && search.trim().length>0)
        link = "https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query="+search;
    else
        link = "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false"

    console.log(link);
    data = await fetch(link);
    filmes = (await data.json()).results;
   
    for(const filme of filmes){
        movie       = document.createElement("div");
        div_info    = document.createElement("div");
        movie_title = document.createElement("span");
        movie_rating= document.createElement("span");
        img         = document.createElement("img");

        movie.style.backgroundImage = `url(${filme.poster_path}) `;
        movie_title.textContent     = filme.title;
        movie_rating.textContent    = filme.vote_average;

        img.src = "./assets/estrela.svg";
        
        div_info.append(movie_title,movie_rating);
        movie.append(div_info);
        movie_rating.append(img);
        movie_title.classList.add(".movie__title");
        movie_rating.classList.add("movie__rating");
        div_info.classList.add("movie__info")
        movie.classList.add("movie");
        
        conteiner.append(movie);

    movie.addEventListener("click",()=> { preencer_modal( filme.id ) })
    }
    cards = document.querySelectorAll(".movie"); 
} 

async function filmeDia() {
    const   video_link  = document.querySelector(".highlight__video-link"),
            video_card  = document.querySelector(".highlight__video"),
            Vtitle      = document.querySelector(".highlight__title"),
            rating      = document.querySelector(".highlight__rating"),
            Vgenres     = document.querySelector(".highlight__genres"),
            launch      = document.querySelector(".highlight__launch"),
            desc        = document.querySelector(".highlight__description");
    
    let data = await fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR");
    const { backdrop_path,title, vote_average, genres, release_date, overview } = (await data.json());

    console.log(video_card);
    video_card.style.backgroundImage= `url(${ backdrop_path })`;
    Vtitle.textContent         = title; 
    rating.textContent         = vote_average;
    Vgenres.textContent        = genres.map((ele)=>{ return ele.name}); 
    launch.textContent         = release_date;
    desc.textContent           = overview;

    data = await fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR");
    const {key}     = (await data.json()).results[0];
    
    video_link.href = "https://www.youtube.com/watch?v="+key;
}

async function preencer_modal(id=123){
    const MTitle    = document.querySelector(".modal__title");
    const MIMG      = document.querySelector(".modal__img");
    const MDesc     = document.querySelector(".modal__description");
    const MAverage  = document.querySelector(".modal__average"),
          generos    = document.querySelector(".modal__genres");

    let data = await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`);
    const {title, backdrop_path, overview, vote_average, genres} = (await data.json());
    
    MTitle.textContent  = title;
    MIMG.src            = backdrop_path;
    MDesc.textContent   = overview;
    MAverage.textContent= vote_average;

    generos.innerHTML   ="";
    for (const genero of genres) {
        generos.innerHTML += `<span class='modal__genre'>${genero.name}<span>`
    }
    

    modal.classList.remove("hidden");
}
fechar_modal = ()=>{
    modal.classList.add("hidden")
}
// ********************************** EVENTS *******************************************
document.querySelector(".btn-next").addEventListener("click",slide);
document.querySelector(".btn-prev").addEventListener("click",InvSlide);
document.querySelector(".modal__close").addEventListener("click",fechar_modal);
modal.addEventListener("click",fechar_modal );

pesquisa.addEventListener("change",(e)=>{
    pega(pesquisa.value);
});
// *****************************  OBRIGATORIOS ******************************************



window.onload = ()=>{
    conteiner.style.width = (168+24)*5+"px"; 
    
    pega(); 
    filmeDia();
}
