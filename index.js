const breeds = [
    "affenpinscher",
    "african",
    "airedale",
    "akita",
    "appenzeller",
    "australian",
    "basenji",
    "beagle",
    "bluetick",
    "borzoi",
    "bouvier",
    "boxer",
    "brabancon",
    "briard",
    "buhund",
    "bulldog",
    "bullterrier",
    "cattledog",
    "chihuahua",
    "chow",
    "clumber",
    "cockapoo",
    "collie",
    "coonhound",
    "corgi",
    "cotondetulear",
    "dachshund",
    "dalmatian",
    "dane",
    "deerhound",
    "dhole",
    "dingo",
    "doberman",
    "elkhound",
    "entlebucher",
    "eskimo",
    "finnish",
    "frise",
    "germanshepherd",
    "greyhound",
    "groenendael",
    "havanese",
    "hound",
    "husky",
    "keeshond",
    "kelpie",
    "komondor",
    "kuvasz",
    "labradoodle",
    "labrador",
    "leonberg",
    "lhasa",
    "malamute",
    "malinois",
    "maltese",
    "mastiff",
    "mexicanhairless",
    "mix",
    "mountain",
    "newfoundland",
    "otterhound",
    "ovcharka",
    "papillon",
    "pekinese",
    "pembroke",
    "pinscher",
    "pitbull",
    "pointer",
    "pomeranian",
    "poodle",
    "pug",
    "puggle",
    "pyrenees",
    "redbone",
    "retriever",
    "ridgeback",
    "rottweiler",
    "saluki",
    "samoyed",
    "schipperke",
    "schnauzer",
    "segugio",
    "setter",
    "sharpei",
    "sheepdog",
    "shiba",
    "shihtzu",
    "spaniel",
    "spitz",
    "springer",
    "stbernard",
    "terrier",
    "tervuren",
    "vizsla",
    "waterdog",
    "weimaraner",
    "whippet",
    "wolfhound"
]
let dogPool

let score;
let startRef = document.querySelector('.btn-start')
let containerRef = document.querySelectorAll(".choice-container")
let scoreRef = document.querySelector('.score')
let quizRef = document.querySelector(".quiz")
let questionsRef = document.querySelectorAll(".question")
let statsRef = document.querySelector(".stats")
let submitRef = document.querySelector(".submit")
let finalStats = document.querySelector(".final-stats")
let allRadioRef = document.querySelectorAll("input")

let dogs = null;
let pics = null;

console.log(questionsRef);

//hides start button
const startGame = () => {
    quizRef.classList.remove("hide");
    startRef.classList.add("hide");
    init()
}



//loads up everything and resets everything
const init = async () => {
    let resetsRef = document.querySelectorAll("form button, form input");
    let colorResetsRef = document.querySelectorAll(".wrapper");

    resetsRef.forEach(x=>{
        x.disabled = false;
        x.checked = false;
    })
    colorResetsRef.forEach(x=>{
        x.classList.remove("red")
        x.classList.remove("green")
    })



    statsRef.classList.add("hide");



    score = 0
    scoreRef.innerText = `${score}/${5}`

    dogPool = [...breeds]

    // generate the answer that are the answers
    dogs = Array.from(Array(5)).map(x => {
        let randNum = Math.floor(Math.random() * (dogPool.length - 0) + 0)
        let answerDog = dogPool[randNum];
        dogPool.splice(randNum, 1);
        return answerDog;
    });
    
    //fetches all the pictures of the breeds chosen
    let picsPromises = Array.from(Array(5)).map(async (x, i) => {
        let pic = await (await fetch(`https://dog.ceo/api/breed/${dogs[i]}/images/random/1`)).json()
        console.log(pic.message[0]);
        return (pic.message[0]);
    })
    pics = await Promise.all(picsPromises)
    console.log(dogs, pics);

    questionsRef.forEach((x, i) => {
        let questImg = x.children[0];
        let questOptions = [...x.children[1].children];
        questImg.src = pics[i]

        let answers = Array.from(Array(3)).map(z => {
            let randNum = Math.floor(Math.random() * (dogPool.length - 0) + 0)
            let wrong = dogPool[randNum]
            dogPool.splice(randNum, 1)
            return wrong;
        })
        answers.splice(Math.floor(Math.random() * (answers.length - 0) + 0), 0, dogs[i]);

        console.log(questOptions);


        questOptions.forEach((y, i) => {
            let radioBtn = y.children[0]
            let radioLabel = y.children[1]

            radioBtn.value = answers[i]
            radioBtn.id = answers[i]
            radioLabel.innerText = answers[i]
            radioLabel.htmlFor = answers[i]

        })

    })

}

//checks answers submitted,disables inputs, and adds the colors to the wrappers.
const check = (e) => {
    e.preventDefault();
    let checkedBtnRefs = document.querySelectorAll("input:checked")
    allRadioRef.forEach(x=>{
        x.disabled = true
    })
    console.log(containerRef);
    

    containerRef.forEach((x,i)=>{
        console.log(x.children);
        let wrapper = [...x.children]
        if(checkedBtnRefs[i].value ===dogs[i]){
            checkedBtnRefs[i].parentNode.classList.add("green")
            score++;
            return
        }
        wrapper.forEach(x=>{


            let node = x.children[0]
            let answer = x.children[0].value
            let result = answer === dogs[i];
            node.checked && result? score++ : false
            console.log(answer, dogs[i],result);
            console.log("choice ", answer, "is checked? ",node.checked, " index: ", i, " dog index ", dogs[i], " result = choice == dogindex",result);
            if(result){
                x.classList.add("green")
            }
            else if(!result){
                x.classList.add("red")
            }
            
        })
    })

    scoreRef.innerText = `${score}/5`
    submitRef.disabled = true
    updateStats()

}

//Adds the users score to the "DB", fetches all the scores, and shows their ranking.
const updateStats = async ()=>{
    let percentScore = score / 5 * 100
    let post = await (await fetch("https://658e13617c48dce94739ed1e.mockapi.io/scores", { method: 'POST', headers: { 'Content-Type': 'application/json' },body:JSON.stringify({score:percentScore}) })).json()

    let get = await (await fetch("https://658e13617c48dce94739ed1e.mockapi.io/scores")).json()

    console.log(post, get);
    get.sort((a,b) => b.score - a.score)

    //finds the index of the users score
    let idk = get.findIndex(x=>x.score === percentScore)

    finalStats.innerText = "You scored in the top: "+ (idk+1) / get.length * 100 + "% out of "+ get.length+ " people"
    console.log("You scored in the top: ", (idk+1) / get.length * 100 , " out of ", get.length, " people");


    statsRef.classList.remove("hide")

    window.scrollTo({ top: 0, behavior: 'smooth' });

}
