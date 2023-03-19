import dotenv from 'dotenv'
import { faker } from '@faker-js/faker'
import axios from 'axios'
import { createCanvas } from 'canvas';

dotenv.config({});



function avatarColor(): string {
    let color = ""
    for (var i = 0; i < 3; i++) {
        var sub = Math.floor(Math.random() * 256).toString(16);
        color += (sub.length == 1 ? "0" + sub : sub);
    }
    return "#"+color
}


function generateAvatar(text: string, backroundColor: string, borderColor = 'white') {
    const canvas = createCanvas(200, 200);
    const context = canvas.getContext('2d')
    context.fillStyle = backroundColor
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle=borderColor;
    context.textAlign='center'
    context.textBaseline='middle'
    context.fillText(text,canvas.width/2,canvas.height/2);
    return canvas.toDataURL('image/png');

}

function generateWork(){
    const workList = [
        'Pediatrician',
        'Child Psychologist',
        'Speech-Language Pathologist',
        'Occupational Therapist',
        'Physical Therapist',
        'Developmental Psychologist',
        'Child and Family Psychologist',
        'Child Psychiatrist',
        'Play Therapist',
        'Behavioral Therapist',
        'Family Therapist',
        'Art Therapist',
        'Other',
      ];
      const randomIndex = Math.floor(Math.random() * workList.length);
      return workList[randomIndex];

}


async function usersData(count:number):Promise<void> {
    try {
        for(let i=0;i<count;i++){
            const username:string=faker.helpers.unique(faker.word.adjective,[8]);
            const color=avatarColor();
            const avatar=generateAvatar(username.charAt(0).toUpperCase(),color)

            const body={
                username,
                email:faker.internet.email(),
                password:'12345',
                avatarColor:color,
                avatarImage:faker.image.avatar(),
                work:generateWork()
            };
           

            console.log(`***ADDING USER TO DATABASE*** -${i+1} of ${count}-${username}`);
            await axios.post(`${process.env.API_URL}/signup`,body)

        }
        
    } catch (error:any) {
        console.log(error?.response?.data);
        
        
    }
    
}

usersData(60)