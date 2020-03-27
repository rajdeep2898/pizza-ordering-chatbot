// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const admin=require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const uuidv1 = require('uuid/v1');


admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL:'ws://pizza-maenfw.firebaseio.com/'
});
//let db=admin.firestore();
//db.settings({timestampsInSnapshots: true});
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 const sessionId=request.body.session.split('/').reverse()[0];
  
  function writeOrderToDb (newOrder) {
    const docRef=db.collection('orders').doc(sessionId);
    
    return db.runTransaction (t =>{
      return t.get(docRef)
      .then(doc =>{
        if(!doc.data()){
          t.set(docRef,{orders:[newOrder]});
        }
      });
  }).catch(err=>{
      console.log(`Error writing to Firestore: ${err}`);
     });
  }
      

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

   // Uncomment and edit to make your own intent handler
   // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
   // below to get this function to be run when a Dialogflow intent is matched
   //function yourFunctionHandler(agent) {
    // agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
   //  agent.add(new Card({
   //      title: `Title: this is a card title`,
    //     imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
    //     text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
     //    buttonText: 'This is a button',
     //    buttonUrl: 'https://assistant.google.com/'
      // })
    // );
//     agent.add(new Suggestion(`Quick Reply`));
//     agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample
	function order_2(agent){
      const order=agent.getContext('order1');
        console.log('Contex name ' + order);

      const pizza=order.parameters.pizz;
            const place=order.parameters.place;
                  const number=order.parameters.number;
    agent.add(`Your order of ${number} ${pizza} is confirmed`);
      //uuidv1(); 
      return writeOrderToDb({
        pizza:pizza,
        address:place,
        number:number
      });
 }
  	function order_nonveg(agent){
      const order=agent.getContext('order1');
              console.log('Contex name ' + order.parameters.pizz);
      const pizza=order.parameters.pizz;
//            const place=order.parameters.place;
            const number=order.parameters.number;
      //uuidv1(); 
          const date = new Date(); 
          const timestamp = date. getTime();
          console.log('Timestamp ' + timestamp);

          agent.add(`Your order of ${number} ${pizza} is confirmed `);
          //agent.add(`Your order ID is ${timestamp}`);
          agent.add(`Do you want to add anything else to your order?`);
          var basketContext={ name: 'basket', lifespan: 50, parameters: {  }};
          agent.setContext({ name: 'reorder', lifespan: 100, parameters: { id: timestamp }});
          agent.setContext({ name: 'end_order', lifespan: 2, parameters: { id: timestamp }});

		var items={};

      items[0]={
        pizza:pizza,
//        address:place,
        number:number
      };
      basketContext.parameters.items=items;
      agent.setContext(basketContext);
      
      admin.database().ref('order').child(timestamp).update({
         flag:0
      });
      admin.database().ref('order').child(timestamp).update({
items
      });
      return;
 }
  
  	function order_veg(agent){
         const order=agent.getContext('order2');
              console.log('Contex name ' + order.parameters.pizz);
      const pizza=order.parameters.pizz;
//            const place=order.parameters.place;
            const number=order.parameters.number;
      //uuidv1(); 
          const date = new Date(); 
          const timestamp = date. getTime();
          console.log('Timestamp ' + timestamp);

          agent.add(`Your order of ${number} ${pizza} is confirmed `);
          //agent.add(`Your order ID is ${timestamp}`);
          agent.add(`Do you want to add anything else to your order?`);
          var basketContext={ name: 'basket', lifespan: 50, parameters: {  }};
          agent.setContext({ name: 'reorder', lifespan: 100, parameters: { id: timestamp }});
          agent.setContext({ name: 'end_order', lifespan: 2, parameters: { id: timestamp }});

		var items={};

      items[0]={
        pizza:pizza,
//        address:place,
        number:number
      };
      basketContext.parameters.items=items;
      agent.setContext(basketContext);
      
      admin.database().ref('order').child(timestamp).update({
         flag:0
      });
      admin.database().ref('order').child(timestamp).update({
items
      });
      return;
 }
  function reorder_nonveg(agent){
          const order=agent.getContext('order3');
            const pizza=order.parameters.pizz;
//            const place=order.parameters.place;
            const number=order.parameters.number;
            const id=order.parameters.id;
			const basket=agent.getContext('basket');
    		const basketItems=basket.parameters.items;
    		const itemKeys=Object.keys(basketItems);
    		const l=itemKeys.length;
    		var items={};
      if(agent.getContext('basket')){
        items=agent.getContext('basket').parameters.items;
        
      }
      items[l]={
        pizza:pizza,
//        address:place,
        number:number
      };
         agent.setContext({ name: 'end_order', lifespan: 2, parameters: { id: id }});

              var basketContext={ name: 'basket', lifespan: 50, parameters: {  }};
                basketContext.parameters.items=items;
      agent.setContext(basketContext);
      agent.add(`Do you want to add anything else to your order?`);

    
      admin.database().ref('order').child(id).update({
         items
      });
          admin.database().ref('order').child(id).update({
         flag:l
      });

    return;

  }
  
   function reorder_veg(agent){
          const order=agent.getContext('order4');
            const pizza=order.parameters.pizz;
//            const place=order.parameters.place;
            const number=order.parameters.number;
            const id=order.parameters.id;
			const basket=agent.getContext('basket');
    		const basketItems=basket.parameters.items;
    		const itemKeys=Object.keys(basketItems);
    		const l=itemKeys.length;
    		var items={};
      if(agent.getContext('basket')){
        items=agent.getContext('basket').parameters.items;
        
      }
     console.log('Order ' + order);
          console.log('Id ' + id);



      items[l]={
        pizza:pizza,
//        address:place,
        number:number
      };
          console.log('items ' + items[0]);
         agent.setContext({ name: 'end_order', lifespan: 2, parameters: { id: id }});
              var basketContext={ name: 'basket', lifespan: 50, parameters: {  }};
                basketContext.parameters.items=items;
      agent.setContext(basketContext);
    
      agent.add(`Do you want to add anything else to your order?`);

      admin.database().ref('order').child(id).update({
         items
      });
          admin.database().ref('order').child(id).update({
         flag:l
      });

    return;

  }
  function check_order(agent){
      const order_id=agent.parameters.id;
          console.log('order id ' + order_id);


      return admin.database().ref('order').child(order_id).once('value').then((snapshot)=>{
        const flag=snapshot.child('flag').val();
        const place=snapshot.child('address').val();

        agent.add(`Your Order Details for the Order ID-${order_id} is`);
        agent.add(`Your Address is ${place}`);

        for(var i=0;i<=flag;i++){
         
        const pizza=snapshot.child('items').child(i).child('pizza').val();
        //const address=snapshot.child('items').child(i).child('address').val();
		const number=snapshot.child('items').child(i).child('number').val();
                    agent.add(`Pizza Ordered-${pizza}`+ `\n`+
			`Number -${number}`);
        }



      });
 }
    function endOrder(agent){
          const end=agent.getContext('end_order');
            const place=end.parameters.place;
            const id=end.parameters.id;

      agent.add(`Your order confirmed`);
      agent.add(`Your order ID is ${id} . Remember your Order ID`);

      admin.database().ref('order').child(id).update({
         address:place
      });


    return;

  }
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
   intentMap.set('pizza.reorder.confirm4', reorder_veg);
   intentMap.set('pizza.reorder.confirm3', reorder_nonveg);
   intentMap.set('pizza.order.confirm', order_nonveg);
   intentMap.set('pizza.order.confirm2', order_veg);
   intentMap.set('pizza.order.check_id', check_order)
   intentMap.set('pizza.end_order.address', endOrder);

  agent.handleRequest(intentMap);
});
