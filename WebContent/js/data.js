
var displayData = function(){
	var self=this;
	var sampleData='';
	
	var i=0;
	var j=0;

	this.init=function(){
		
		//self.render(null);
		self.showData();
		
	}

	this.showData=function(){
		self.connectToFirebase();
		
		
	}
	this.connectToFirebase=function(){
		var tableData=[[]];
		var config = {
			    apiKey: "AIzaSyDYmvB8cwPBQfAMV1QBHHP5iydEq6OCmF0",
			    authDomain: "webapp-3b7ce.firebaseapp.com",
			    databaseURL: "https://webapp-3b7ce.firebaseio.com",
			    projectId: "webapp-3b7ce",
			    storageBucket: "webapp-3b7ce.appspot.com",
			    messagingSenderId: "604401747935"
			  };
			  firebase.initializeApp(config);
			  
			  const db = firebase.firestore();
			  var citiesRef = db.collection('kriger');
			  var query = citiesRef.get()
			      .then(snapshot => {
			    	  
			        snapshot.forEach(doc => {
			        	
			          console.log(doc.id, '=>', doc.data());
			          var tempArr=[];
			          tempArr[0]=doc.data().Model;
			          tempArr[1]=doc.data().MPG;
			          tempArr[2]=doc.data().Cylinders;
			          tempArr[3]=doc.data().Displacement;
			          tempArr[4]=doc.data().Horsepower;
			          tempArr[5]=doc.data().Weight;
			          tempArr[6]=doc.data().Acceleration;
			          tempArr[7]=doc.data().Year;
			          tempArr[8]=doc.data().Origin;
			          
			          tableData[i]=tempArr;
			          i++;
			         
			        });
			      
			        if ( typeof(tableData) == "object") {
				        for (var j = 0; j < tableData.length; j++) {
				        	sampleData=sampleData+"<tr>";
				        	for (var k = 0; k < tableData[j].length; k++) {
				        		sampleData=sampleData+"<td>"+tableData[j][k]+"</td>";
								
							}
				        	sampleData=sampleData+"</tr>";
				        }
				    }
			        self.render(sampleData);
			      })
			      .catch(err => {
			        console.log('Error getting documents', err);
			      });
			  
	}

	
	this.render=function(){
		var arr=[];
		arr.push('<center><h1>Welcome</h1></center>');
		arr.push('<table id="test" class="table table-striped table-bordered table-hover" border="1" cellspacing="0">');
		arr.push('	<thead>');
		arr.push('		<tr style="background-color: #DBF76B;color: #0D48F4;">');
		arr.push('			<th>Model</th>');
		arr.push('			<th>MPG</th>');
		arr.push('			<th>Cylinders</th>');
		arr.push('			<th>Displacement</th>');
		arr.push('			<th>Horsepower</th>');
		arr.push('			<th>Weight</th>');
		arr.push('			<th>Acceleration</th>');
		arr.push('			<th>Year</th>');
		arr.push('			<th>Origin</th>');
		arr.push('		</tr>');
		arr.push('	<thead>');
		
		arr.push('	<tbody>');
		arr.push(sampleData);
		arr.push('	</tbody>');
		
		arr.push('</table>');
		
		$('#dataTable').html(arr.join(''));
		var table = $('#test').dataTable({
			"order": [[0, "asc" ]],
			"autoWidth": false
		});

	}
}