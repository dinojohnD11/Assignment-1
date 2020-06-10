class Ieentry{
    constructor(ie,date,name,amount)
    {
        this.ie=ie;
        this.date=date;
        this.name=name;
        this.amount=amount;
    }
}



class UI{
    addieentrytoList(ieentry)
    {
        const list=document.getElementById('ie-list');
        const row=document.createElement('tr');
        row.innerHTML=`
            <td>${ieentry.ie}</td>
            <td>${ieentry.date}</td>
            <td>${ieentry.name}</td>
            <td>${ieentry.amount}</td>
            <td><a href="#" class="delete">&times<a></td>
            `;
            if((ieentry.ie=='I'))
            row.style.backgroundColor='#67e467';
            else
            row.style.backgroundColor='#e94f4f';
            list.appendChild(row);
           
    }

    showAlert(message, className)
    {
        const alertdiv=document.getElementById('alert');
        alertdiv.className=`${className}`;
        alertdiv.textContent=message;
        setTimeout(function()
        {
            alertdiv.className="hide";
        }, 2500);
    }

    deleteieentry(target) 
    {
        
        target.parentElement.parentElement.remove();
        console.log('spliced from ls');
        
    }
    clearTextarea()
    {
        document.querySelector('#ie-input').value='';
    }
    updateIEB()
    {

    }

}

class LocalStore{

    static getieentriesfromLS() {
        let ieentries;
        if(localStorage.getItem('ieentries') === null) {
          ieentries = [];
        } else {
          ieentries = JSON.parse(localStorage.getItem('ieentries'));
        }
    
        return ieentries;
      }

      static displayieentries() {
        const ieentries = LocalStore.getieentriesfromLS();
       let income=Number(document.getElementById('ti').innerHTML);
       let expense=Number(document.getElementById('te').innerHTML);
        ieentries.forEach(function(ieentry){
            const ui  = new UI;
            if(ieentry.ie=='I')
            {income+=Number(ieentry.amount);}
            else
            {expense+=Number(ieentry.amount);}
            ui.addieentrytoList(ieentry);
        });
        document.getElementById('ti').innerHTML=income;
        document.getElementById('te').innerHTML=expense;
        document.getElementById('b').innerHTML=Number(income-expense);
      }

      static addieentry(ieentry) {
        const ieentries = LocalStore.getieentriesfromLS();
    
        ieentries.push(ieentry);
    
        localStorage.setItem('ieentries', JSON.stringify(ieentries));
      }

      static removeieentry(ie,date,name,amount) {
        const ieentries = LocalStore.getieentriesfromLS();
        
        let found=false;
    
        ieentries.forEach(function(ieentry, index){
         if((found==false)&&(ieentry.ie == ie)&&(ieentry.date==date)&&(ieentry.name==name)&&(ieentry.amount==amount)) {
          ieentries.splice(index, 1);
          console.log('deleting from ls');
          found=true;
         }
        });
    
        localStorage.setItem('ieentries', JSON.stringify(ieentries));
      }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', LocalStore.displayieentries);

//even listner for delete
document.querySelector('#tablecontainer').addEventListener('click',function(e)
{
    if(e.target.className=='delete')
    {
    const ui = new UI();
    
    const amount=e.target.parentElement.previousElementSibling.textContent;
    const name=e.target.parentElement.previousElementSibling.previousElementSibling.textContent;
    const date=e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    const ie=e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    ui.deleteieentry(e.target);

    let income=Number(document.getElementById('ti').innerHTML);
    let expense=Number(document.getElementById('te').innerHTML);
    if(ie=='I')
        {income-=Number(amount);}
    else
        {expense-=Number(amount);}
    document.getElementById('ti').innerHTML=income;
    document.getElementById('te').innerHTML=expense;
    document.getElementById('b').innerHTML=Number(income-expense);
    
    
    // const ieentry=new Ieentry(ie,date,name,amount);
    // LocalStore.removeieentry(ieentry);
    LocalStore.removeieentry(ie,date,name,amount);
    ui.showAlert('The entry has been removed!','success');
    e.preventDefault();
    }
});

//even listner for submit

document.getElementById('submitbtn').addEventListener('click',function(e)
{
    const ui=new UI();
    const datainCSV=document.getElementById('ie-input').value;
    const validation= validate(datainCSV);
    if(validation)
    {   let income=Number(document.getElementById('ti').innerHTML);
        let expense=Number(document.getElementById('te').innerHTML);
        arr=datainCSV.split('\n');
        
        let headers = arr[0].split(',');
        for(let i = 1; i < arr.length; i++) 
        {
            let data = arr[i].split(',');
            
            
            const ieentry=new Ieentry(data[0].toUpperCase().trim(),data[1].trim(),data[2].trim(),data[3].trim());
            ui.addieentrytoList(ieentry);

            
            if(ieentry.ie=='I')
                {income+=Number(ieentry.amount);}
            else
                {expense+=Number(ieentry.amount);}
            

            LocalStore.addieentry(ieentry);
            
           
        }
        document.getElementById('ti').innerHTML=income;
        document.getElementById('te').innerHTML=expense;
        document.getElementById('b').innerHTML=Number(income-expense);
        ui.showAlert('Entries are added successfully!','success');
        ui.clearTextarea();
        
    }

    
    e.preventDefault();
});


function validate(datainCSV)
{ 
    const ui=new UI();
    if (datainCSV=='')
    {
        
        ui.showAlert('Input is empty! Enter the value in CSV fromat with header','error');
        //ui.clearTextarea();

        return false;
    }
    arr=datainCSV.split('\n');
        
    let hd = arr[0].split(',');//header
    if (hd.length!==4)
    {
        ui.showAlert('Header is incorrect! Enter the value in CSV fromat with header','error');
        //ui.clearTextarea();
        return false;

    }
    for(let i=0;i<4;i++)
    {
        hd[i]=hd[i].toLowerCase().trim();
    }
    
    if(!(((hd[0]==='i-e')||(hd[0]==='ie')||(hd[0]==='i/e'))&&(hd[1]==='date')&&(hd[2]==='name')&&(hd[3]==='amount')))
    {
        ui.showAlert('Header is not correct! Enter the value in CSV fromat with header','error');
        return false;
    }
    
    if(arr.length==1)
    {
        ui.showAlert('Only header is present! Enter the value in CSV fromat below header','error');
        return false;
    }
    if(arr[arr.length-1]=='')
    {
        ui.showAlert('Last entry is empty! Do not enter a linebreak after the last entry.','error');
        return false;
    }


    for(let i = 1; i < arr.length; i++) 
        {
            let data = arr[i].split(',');
            for(let j=0;j<4;j++)
            {
                data[j]=data[j].trim();
                if(data[j]=='')
                {
                    ui.showAlert(`${hd[j]} of entry number ${i} is empty`,'error');
                    return false;
                }


            }
            if(data.length!=4)
            {
                ui.showAlert(`${data.length} values in entry number ${i}.`,'error');
                    return false;
            }
            if(!((data[0].toLowerCase()=='i')||(data[0].toLowerCase()=='e') ))
            {
                ui.showAlert(`I/E type of entry number ${i} is not correct`,'error');
                return false;
            }
            
            const thedate=new Date(`${data[1]}`);
            const stringvalue=thedate.toString();

            if(stringvalue=='Invalid Date')
            {
                ui.showAlert(`Date of entry number ${i} is not correct`,'error');
                return false;
            }

            if(isNaN(data[3]))
            {
                ui.showAlert(`Amount of entry number ${i} is not a valid number`,'error');
                return false;
            }
            if(Number(data[3]<0))
            {
                ui.showAlert(`Amount of entry number ${i} is negative`,'error');
                return false;
            }
            


        }
        console.log('valid');
    return true;



}


