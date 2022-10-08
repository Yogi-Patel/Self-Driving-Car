
// Following lines get the canvas and change the dimensions of the canvas
const carCanvas = document.getElementById("carCanvas");
//canvas.height = window.innerHeight;
carCanvas.width = 200; //window.innerWidth/3;
console.log(carCanvas.width);
const netoworkCanvas = document.getElementById("networkCanvas");
//canvas.height = window.innerHeight;
networkCanvas.width =window.innerWidth/2;

//The getContext() is a built-in HTML object, with properties and methods for drawing
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");


const road = new Road(carCanvas.width/2, carCanvas.width*0.9, 3);

const N = 00;
const cars = generateCars(N);
let bestCar = cars[0];

model_string = '{"levels":[{"inputs":[0,0,0,0.06283831007554463,0.4928117482064652],"outputs":[1,0,0,0,1,1],"biases":[-0.0767201067711934,0.2387048901009332,0.3836063807405853,-0.10060181674733508,-0.43946766318612995,-0.383118412795806],"weights":[[0.2585508332787222,0.5553096336434219,-0.3113253443398234,-0.5401561614523286,0.31374620141086557,0.44044783669783066],[-0.8039747568114595,-0.4883431881618689,-0.20808676168142748,-0.31388463429637126,-0.16431233696049974,-0.5169019628315572],[0.3257954834681559,-0.6609609863344936,0.07758248958728328,-0.19441445004308716,-0.9567431335180109,-0.2536457325171525],[-0.017469354359902406,0.17967511917223336,0.7703511167447069,-0.588999143782756,-0.10852182719442593,0.3279709548117641],[0.01074470881304615,-0.5910450510082981,0.5662118103370972,-0.4812651677307503,0.06113779697532164,-0.3714048299516219]]},{"inputs":[1,0,0,0,1,1],"outputs":[1,0,0,0],"biases":[-0.20845167644216875,-0.05486845300204629,-0.7055553684251814,0.17139823429428364],"weights":[[0.015838959122229213,0.10689735790784143,-0.8877252464982426,-0.21783661031701565],[0.03906515348765119,-0.02930183313472101,0.05356560255744053,-0.5852191484396305],[0.29118063958706647,0.7682933953470616,0.07770210901520969,-0.10526645708306415],[-0.010485156366595028,0.3251587138998363,-0.23651017429439652,0.3589705215351405],[0.7962390092254541,-0.5883426610707192,-0.09055770689080268,-0.321581455593558],[-0.40221250025652644,0.38853524695938285,-0.5723412468049179,-0.20344984181231007]]}]}'
if(localStorage.getItem("bestBrain"))
{
    for(let i=0; i<cars.length; i++)
    {
        //cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
        cars[i].brain = JSON.parse(model_string);
        if(i!=0)
        {
            NeuralNetwork.mutate(cars[i].brain, 0.3);
        }
    }
    
}


function getMultipleRandom(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
  
    return shuffled.slice(0, num);
  }


// const traffic = [];
// for (let i = 1; i<100; i += 2)
// {
//     arr = getMultipleRandom([0,1,2], 2);
//     for (let j = 0; j<2; j++)
//     {
//         traffic.push(new Car(road.getLaneCenter(arr[j]), -100*i, 30, 50, "DUMMY", 2));
//     }

    
// }
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -900, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -900, 30, 50, "DUMMY", 2),
]
animate();

function save()
{
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard()
{
    localStorage.removeItem("bestBrain");
}

function generateCars(N)
{
    const cars = [];
    for(let i = 0; i<=N; i++)
    {
        cars.push(new Car(road.getLaneCenter(1), 100,30,50, "AI"))
    }
    return cars;
}



function animate(time) 
{
    for(let i =0; i<traffic.length; i++)
    {
        traffic[i].update(road.borders, []);
    }

    for(let i =0; i<cars.length; i++)
    {
        cars[i].update(road.borders, traffic);
    }
    
    bestCar = cars.find(
        c=>c.y==Math.min(...cars.map(c=>c.y))
    );


    carCanvas.height = window.innerHeight; //changing the canvas height here makes sure that the canvas refreshes 
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i =0; i<traffic.length; i++)
    {
        traffic[i].draw(carCtx, "red");
    }

    carCtx.globalAlpha = 0.2;
    for(let i =0; i<cars.length; i++)
    {
        cars[i].draw(carCtx, "blue");
    }

    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true);


    carCtx.restore();

    //networkCtx.lineDashOffset = -time/1;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate); // calls the animate function again and again;
}