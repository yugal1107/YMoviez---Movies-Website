import express from "express";
import axios from "axios";
import axiosRetry from 'axios-retry';
import ejs from "ejs";


axiosRetry(axios, { retries: 3 });
import {} from 'dotenv/config';

const app = express();
const port = 3000;
// const hostname =  "192.168.146.4";

const api_key_auth = process.env.apikeyauth;
const access_token_auth = process.env.accesstokenauth;
let baseimgURL = 'https://image.tmdb.org/t/p/w500';

app.use(express.static("public"));

app.get("/", async (req,res) => {

    // Method 1 : Angela Yu
    console.log("Fetching API");
    try{
        
        const response4 = await axios.get("https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1" , {
            timeout: 1000,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${access_token_auth}`
            }
        });
    
        const hindidata = await response4.data;
        const hindimovie = await hindidata.results;

        console.log("API 1 fetched successfully");

        const response1 = await axios.get("https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1" , {
            timeout: 1000,   
        headers: { 
                accept: 'application/json',
                Authorization: `Bearer ${access_token_auth}`
            }
        });
        const nowplayingdata = await response1.data;
        const nowplayingmovie = await nowplayingdata.results;

        console.log("API 2 fetched successfully");
        
        // Method 2 

        // const options = {
        // method: 'GET',
        // url: 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1',
        // headers: {
        //     accept: 'application/json',
        //     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYWExM2I2ZWU0N2Q0ZGFjMjE4ZjIyZTdhMmQzYjU4ZiIsInN1YiI6IjY1OGRiOWRmOGVkMDNmNWU4MDkzZjcwNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EN9Lg9h_JqSPfjmYYYCTir5S8664u_3moUjojoauqI0'
        // }
        // };

        // axios
        // .request(options)
        // .then(function (response) {
        //     console.log(response.data);
        // })
        // .catch(function (error) {
        //     console.error(error);
        // });


        // console.log(data);

        const response2 = await axios.get("https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1" , {
            timeout: 1000,   
        headers: {
                accept: 'application/json',
                Authorization: `Bearer ${access_token_auth}`
            }
        });
        const populardata = await response2.data;
        const popularmovie = await populardata.results;
        // console.log(nowplayingdata[0]);
        
        console.log("API 3 fetched successfully");
    
        // console.log(moviedata[0]);
        
                
        res.render("index.ejs" , {hi : hindimovie , p : popularmovie , np : nowplayingmovie , baseimgURL: baseimgURL});
        console.log("Get request accepted");

    } catch(error){
        res.send("Sorry , we are getting some error with API now ...")
        console.log("Sorry , we are getting some type of error .......");
        console.error(error);
    }

});

console.log("Fetching of APIs and dispalying them done......")

app.get("/movie/:movieid" , async (req,res) => {
    let movieid = req.params.movieid;

    try {
        console.time("API request");
        let response;
        let castapi;

        [response,castapi] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/movie/${movieid}?api_key=${api_key_auth}`),
            axios.get(`https://api.themoviedb.org/3/movie/${movieid}/credits?language=en-US` , {
                timeout: 1000,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${access_token_auth}`
            }
        })
        ]);

        let data = await response.data;
        let castdata = await castapi.data;
        console.timeEnd("API request");
        
        res.render("movie.ejs" , {data : data , baseimgURL: baseimgURL , castdata : castdata});

        for (let i=0 ; i< castdata.cast.length ; i++){
            console.log(castdata.cast[i].name);
        }
        console.log(castdata.cast.length);
    }catch(error){
        console.error(error);
        // console.error(error);
    }

});

app.get("/cast/:cid/:cname" , async (req,res) => {
    let person_id = req.params.cid;
    let person_name = req.params.cname;
    try {
        // API request 

        const response = await axios.get(`https://api.themoviedb.org/3/person/${person_id}/movie_credits` , {
            timeout: 1000,  
        headers: {
                accept: 'application/json',
                Authorization: `Bearer ${access_token_auth}`
            }
        });
        const result = await response.data;

        // console.log(result);

        res.render("cast.ejs", {hi : result , baseimgURL : baseimgURL , cname : person_name});

    }catch(error){
        console.error(error);
    }

    
});


app.get("/category/:gid/:gname" , async (req,res) => {
    let genreid = req.params.gid;
    let genrename = req.params.gname;
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreid}` , {
            timeout: 1000,  
        headers: {
                accept: 'application/json',
                Authorization: `Bearer ${access_token_auth}`
            }
        });
        const result = await response.data;


        res.render("genre.ejs" , {genre : result , baseimgURL : baseimgURL , gname : genrename });
    }catch(error){
        console.error(error);
    }

});


app.listen(port  , () => {
    console.log("Server running in port 3000....");
});