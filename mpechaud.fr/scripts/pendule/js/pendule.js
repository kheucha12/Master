/*
Author: Mickaël Péchaud (m,i,c,k,a,e,l,p,e,c,h,a,u,d,@,g,m,a,i,l,.,c,o,m)
This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
*/


window.onload=function() {   
    w=700;
    h=600;

    wph=700;
    hph=300;
    
    wanim=300;
    hanim=300;
    
    ox=20;
    oy=h/2;

    oxph=wph/2;
    oyph=hph/2;
    
    oxanim=wanim/2;
    oyanim=20;
    
    
    unity=25;

    nux=(w-ox)/unity;

    initAnim();
    initGraph();
    initPhase();

    var ec = document.getElementById('ec');
    ec.addEventListener("change", function(e) {
	stopSimulation();
	var entr = document.getElementById('entr');
	if (ec.checked)
	{
	    entr.style.visibility = "visible";
	}
	else
	{
	    entr.style.visibility = "hidden";
	}
	    
    });
    
    
    var canvas = document.getElementById('phase');
    canvas.addEventListener("mousedown", function(e) {	
	var clx = e.pageX - canvas.offsetLeft;
        var cly = e.pageY - canvas.offsetTop;
	let x = (clx - oxph)/unity;
	let y = -(cly - oyph)/unity;
	document.getElementById("yz").value = x;
	document.getElementById("ypz").value = y;
	simuler();
    });
    
}

function is_animated() {
    return (document.getElementById("animation").checked);
}

function is_forced() {
    return (document.getElementById("ec").checked);
}

function is_forced_and_phase_animated() {
    return (document.getElementById("ec").checked && document.getElementById("anec").checked);
}

// function second_membre(l1, omega, theta, t, b, g) {
//     return -(1+l1*omega**2/g*Math.cos(omega*t))*g*Math.sin(theta)+l1*omega**2*Math.sin(omega*t)*Math.cos(theta);
// }

function simuler(){
    
    stopSimulation();
    //if (typeof animationinterval !== 'undefined')
	//clearInterval(animationinterval);
    
//    var anim = document.getElementById("animation").checked; 
    
    a=document.getElementById("a").value;
    b=document.getElementById("b").value;
    var yz=document.getElementById("yz").value;
    var ypz=document.getElementById("ypz").value;
    //sm=document.getElementById("sm").options[document.getElementById("sm").selectedIndex].value;

    if (is_forced())
    {	
	l1 = 100 * document.getElementById("rl").value;
	omega = document.getElementById("omega").value;
    }
    else
    {
	l1 = omega = 0;
    }
    
    var ta;
    var tb;
    if (a<0) ta=a; else ta="+"+a;
    if (b<0) tb=b; else tb="+"+b;
    
    

    
    yp=parseFloat(ypz);
    y=parseFloat(yz);

    //with sin(x) = x
    ypapprox = yp;
    yapprox = y;
    
    drawphx=oxph+y*unity-1;
    drawphy=oyph-yp*unity-1;

    drawphxapprox=oxph+yapprox*unity-1;
    drawphyapprox=oyph-ypapprox*unity-1;

    
    if (isNaN(yp) || isNaN(y))
    {
	
	stopSimulation();
	
	alert('Conditions initiales incorrectes');
	return;
    }
    

    

    
    
    
    initAnim();
    initGraph();
    initPhase();
    
    
    var ctx=document.getElementById('dessin').getContext('2d');

    var ctxph=document.getElementById('phase').getContext('2d');

    step=0.02;


    
    a=parseFloat(a);
    b=parseFloat(b);
    
    
    if (isNaN(a) || isNaN(b))
    {
	stopSimulation();
	
	alert('Paramètres incorrects.');
	return;
    }


    
    if (!is_animated())
    {
	ctx.strokeStyle='red';
	ctx.lineWidth='2';
	ctx.beginPath();
        
	ctxph.strokeStyle='red';
	ctxph.fillStyle='red';
	ctxph.lineWidth='2';
	ctxph.beginPath();
		
	ctxph.fillRect(oxph+y*unity-1,oyph-yp*unity-1,3,3);

	
	ctx.moveTo(ox,oy-y*unity);
	ctxph.moveTo(oxph+y*unity,oyph-yp*unity);
	
	//Simulation utilisant la méthode de Heun.
	var c = 0;
	for (k=0; k<4*nux; k+=step)
	{
	    simulationstep();
	    

	    if (c % 10 == 0)
	    {
		ctx.stroke();
		ctxph.stroke();
		

		if (! is_forced())
		{
		    ctx.save();
		    ctxph.save();

		    ctx.strokeStyle='blue';
		    ctx.beginPath();
		    ctx.arc(ox+k*unity,oy-yapprox*unity, 1, 0, 2 * Math.PI, false);
		    ctx.stroke();
		    
		    ctxph.strokeStyle='blue';
		    ctxph.beginPath();
		    ctxph.arc(oxph+yapprox*unity,oyph-ypapprox*unity, 1, 0, 2 * Math.PI, false);
		    ctxph.stroke();
		    ctx.restore();
		    ctxph.restore();

		}
		
		ctx.beginPath();
		ctxph.beginPath();
	    }
	    ctx.lineTo(ox+k*unity,oy-y*unity);
	    ctxph.lineTo(oxph+y*unity,oyph-yp*unity);

	    
	    if (y>1000 || y<-1000) 
	    {
		alert("La solution devient trop grande en valeur absolue, le tracé est interrompu.");
		break;
	    }
	    c++;
	    
	}
	ctx.stroke();
	ctxph.stroke();
    }
    else
    {
	k=0;
	compteur=0;
	animationinterval=setInterval(animStep,8);
    }

}

function animStep(){
    
    var ctx=document.getElementById('dessin').getContext('2d');    
    var ctxph=document.getElementById('phase').getContext('2d');
    var ctxanim=document.getElementById('anim').getContext('2d');
    
    ctxph.strokeStyle='red';
        
    //effacement 
    ctxph.fillStyle='red';
    
    //    ctxph.fillRect(oxph+y*unity-2,oyph-yp*unity-2,4,4);
    ctxph.fillRect(drawphx,drawphy,2,2);
    initAnim();
    if (is_forced_and_phase_animated())
	initPhase(k);

    
    ctx.strokeStyle='red';
    ctx.fillStyle='red';
    ctxanim.strokeStyle='red';
    ctxanim.fillStyle='red';
    
    
    //pré-tracés
    ctxph.fillStyle='orange';
    ctxph.beginPath();
    ctx.beginPath();
    ctx.moveTo(ox+k*unity,oy-y*unity);
    ctxph.moveTo(oxph+y*unity,oyph-yp*unity);
    
//    var savyapprox = yapprox;
//    var savypapprox = ypapprox;
    
    //simulation
    simulationstep();
    k+=step;
    compteur+=1;

    
    //tracés
    drawphx=oxph+y*unity-1;
    drawphy=oyph-yp*unity-1;

    ctxph.fillRect(drawphx,drawphy,2,2);

    if (is_forced_and_phase_animated())
    {
	ctxph.fillStyle = "#ff0000";
	ctxph.fillRect(drawphx,drawphy,5,5);
    }
    ctx.lineTo(ox+k*unity,oy-y*unity);
    ctxph.lineTo(oxph+y*unity,oyph-yp*unity);    
    

    ctx.stroke();    
    ctxph.stroke();



    
    if (compteur%3 == 0 && ! document.getElementById("ec").checked){
	ctx.fillStyle='blue';
	ctx.beginPath();
	ctx.arc(ox+k*unity,oy-yapprox*unity, 1, 0, 2 * Math.PI, false);
	ctx.fill();
	
	ctxph.strokeStyle='blue';
	ctxph.beginPath();
	ctxph.arc(oxph+yapprox*unity,oyph-ypapprox*unity, 1, 0, 2 * Math.PI, false);
	ctxph.stroke();
    }




    /*
    var center=(oxanim+wanim)/2;
    var ord1 = oyanim;
    var ord2 = oyanim-y*unity;
    var diff = (ord2-ord1)/10;
    */
//    var colbase=256*2*88+258*88+255;

    
    var l = 100;
    var centerx = wanim/2+l*Math.sin(y);
    var centery = 120+l*Math.cos(y);
    

    var sx = l1*Math.cos(omega*k);
    var sy = -l1*Math.sin(omega*k);


    ctxanim.fillStyle='black';
    ctxanim.strokeStyle='black';

    ctxanim.lineWidth='1';
    ctxanim.beginPath();
    ctxanim.arc(wanim/2, 120, Math.sqrt(sx**2+sy**2), 0-omega*k, 3/2*Math.PI-omega*k, false);
    ctxanim.stroke();

    ctxanim.lineWidth='2';
    ctxanim.fillRect(wanim/2-5, 120-5, 10, 10);

    ctxanim.beginPath();
    ctxanim.arc(wanim/2+sx, 120+sy, 3, 0, 2*Math.PI, false);
    ctxanim.fill();

    /*
    ctxanim.beginPath();
    ctxanim.moveTo(wanim/2, 100);
    ctxanim.lineTo(wanim/2+sx, 100+sy);
    ctxanim.stroke();
    */
    
    //fil + mass
    ctxanim.beginPath();
//    console.log(omega);
//    console.log(l1*Math.cos*(omega*k));
    ctxanim.moveTo(wanim/2+sx, 120+sy);
    ctxanim.lineTo(centerx+sx, centery+sy);
    ctxanim.stroke();

    ctxanim.fillStyle='#991223';
    ctxanim.beginPath();
    ctxanim.arc(centerx+sx, centery+sy, 10, 0, 2*Math.PI, false);
    ctxanim.fill();



    
    ctxanim.fillStyle='#a81223';
    ctxanim.beginPath();
    ctxanim.arc(centerx+sx, centery+sy, 9, 0, 2*Math.PI, false);
    ctxanim.fill();

    
    ctxanim.fillStyle='#cc1223';
    ctxanim.beginPath();
    ctxanim.arc(centerx+sx, centery+sy, 8, 0, 2*Math.PI, false);
    ctxanim.fill();

    ctxanim.strokeStyle='#d77273';
    ctxanim.beginPath();
    ctxanim.arc(centerx+sx, centery+sy, 6, 2*Math.PI/3+.2, 2*Math.PI/3+1.5-.2, false);
    ctxanim.stroke();

    ctxanim.beginPath();
    ctxanim.arc(centerx+sx, centery+sy, 5, 2*Math.PI/3, 2*Math.PI/3+1.5, false);
    ctxanim.stroke();
    ctxanim.strokeStyle='#e79293';

    ctxanim.beginPath();
    ctxanim.arc(centerx+sx, centery+sy, 4, 2*Math.PI/3, 2*Math.PI/3+1.5, false);
    ctxanim.stroke();
    ctxanim.strokeStyle='#d77273';
//    ctxanim.strokeStyle='#d77273';
    ctxanim.beginPath();
    ctxanim.arc(centerx+sx, centery+sy, 3, 2*Math.PI/3, 2*Math.PI/3+1.5, false);
    ctxanim.stroke();

    
    
    
    //ressort
//     for (var i=1; i<=10; i++)
//     {
// 	ctxanim.beginPath();
	
// //	var col=colbase*i/10;

// 	if (i==10) {
// 	    ctxanim.moveTo(center+unity/2,ord1+(i-1)*diff);
// 	    ctxanim.lineTo(center,ord1+i*diff);	    
// 	}
// 	else
// 	if (i%2 == 0)
// 	    {
// 		ctxanim.moveTo(center+unity/2,ord1+(i-1)*diff);
// 		ctxanim.lineTo(center-unity/2,ord1+i*diff);
// 	    }
// 	else
// 	    {
// 		ctxanim.moveTo(center-unity/2,ord1+(i-1)*diff);
// 		ctxanim.lineTo(center+unity/2,ord1+i*diff);
// 	    }
// 	ctxanim.stroke();

//     }
    
    
//    ctxanim.fillStyle='#8888ff';
    
   // ctxanim.fillRect(0,ord1-2,wanim,4);
    /*
    ctxanim.beginPath();
    ctxanim.arc(center, ord1, 5, 0, 2 * Math.PI, false);
    ctxanim.fill();
    */

    /*
    ctxanim.fillStyle='red';
    
    ctxanim.beginPath();
    ctxanim.arc(center, ord2, 3, 0, 2 * Math.PI, false);
    ctxanim.fill();
    */


    if (y>1000 || y<-1000) 
    {
//	if (typeof animationinterval !== 'undefined')
//	    clearInterval(animationinterval);
	stopSimulation();
	alert("La solution devient trop grande en valeur absolue, le tracé est interrompu.");
    }
//    k+=1;
}

function simulationstep(){
    var en = yp**2-2*b*Math.cos(y);
//    console.log(en);
    //Schéma de Heun (point moitié)
    var fy1=yp;
    var fy2=-b*Math.sin(y)-a*yp - l1/100*omega**2*Math.sin(y-omega*(k));
//    console.log(l1/150*omega**2*Math.sin(y-omega*k));
//    console.log("D "+(-b*Math.sin(y)-a*yp));
    var fy1tot=0.5*(fy1+(fy1+step*fy2));
    var fy2tot=0.5*(fy2+(fy2+step*(-b*Math.sin(fy1)-a*fy2 - l1/100*omega**2*Math.sin(fy1-omega*(k+1/2)))));

//    fy2tot -= ;
    
    y=y+step*fy1tot;
    yp=yp+step*fy2tot;

    var s = (yp > 0);

    var en2 = yp**2-2*b*Math.cos(y);
    if (// ( a >= 0 && 0.05 >= a && en2 > en) ||
	(a == 0 && l1 == 0 && omega == 0 && en2 !== en))
    {
	if (s)
	    yp = Math.sqrt(Math.max(0,en+2*b*Math.cos(y)));
	else
	    yp = -Math.sqrt(Math.max(0,en+2*b*Math.cos(y)));
    }
    
    var fy1a=ypapprox;
    var fy2a=-b*yapprox-a*ypapprox;
    
    var fy1tota=0.5*(fy1a+(fy1a+step*fy2a));
    var fy2tota=0.5*(fy2a+(fy2a+step*(-b*fy1a-a*fy2a)))
    
    
    yapprox=yapprox+step*fy1tota;
    ypapprox=ypapprox+step*fy2tota;



}





function initGraph(){
    var ctx=document.getElementById('dessin').getContext('2d');
    ctx.fillStyle='lightgray';
    ctx.fillRect(0,0,w,h);
    
    ctx.font = "16px Arial";
    ctx.fillStyle='#444444';
    ctx.fillText("0", ox-12, oy+16);
    
    ctx.fillText("t", w-12, oy+16);
    
    ctx.fillText("\u03B8(t)", ox-16, 16);

    
    ctx.strokeStyle='black';
    ctx.lineWidth='2';
    ctx.beginPath();
    ctx.moveTo(ox,0);
    ctx.lineTo(ox,h);
    
    for (var k=-12; k<=12; k++)
    {
	ctx.moveTo(ox,oy+unity*k);
	ctx.lineTo(ox+5,oy+unity*k);
    }

    for (var k=0; k<=nux; k++)
    {
	ctx.moveTo(ox+unity*k,oy);
	ctx.lineTo(ox+unity*k,oy-5);
    }
    
    
    
    ctx.moveTo(ox,h/2);
    ctx.lineTo(w,h/2);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle='#CCCCCC';
    ctx.lineWidth='2';
    ctx.beginPath();
    
    for (var k=-10; k<=10; k++)
    {
	if (k==0) continue;
	ctx.moveTo(ox+5,oy+unity*k);
	ctx.lineTo(w,oy+unity*k);
    }
    ctx.stroke();
    
    
}



function initAnim(){
    var ctx=document.getElementById('anim').getContext('2d');
    ctx.fillStyle='lightgray';
    ctx.fillRect(0,0,wanim,hanim);
    
    ctx.font = "16px Arial";
    ctx.fillStyle='#000000';
    
}



function stopSimulation(){
    if (typeof animationinterval !== 'undefined')
    {
	clearInterval(animationinterval);
	a=document.getElementById("a").value;
	b=document.getElementById("b").value;
	
	initPhase();
    }
}

function initPhase(k = null){
    var ctx=document.getElementById('phase').getContext('2d');
    var a=parseFloat(document.getElementById("a").value);
    var b=parseFloat(document.getElementById("b").value);

    if (is_forced())
    {	
	l1 = 100 * document.getElementById("rl").value;
	omega = document.getElementById("omega").value;
    }
    else
    {
	l1 = omega = 0;
    }


    
    ctx.globalCompositeOperation='source-over';
    
    ctx.fillStyle='lightgray';
    ctx.fillRect(0,0,wph,hph);
    
    
    ctx.font = "16px Arial";
    ctx.fillStyle='#444444';
    ctx.fillText("0", oxph-12, oyph+16);
    
    ctx.fillText("\u03B8", wph-12, oyph+16);
    
    ctx.fillText("\u03B8'", oxph-16, 16);

    ctx.strokeStyle='black';
    ctx.lineWidth='2';
    ctx.beginPath();
    ctx.moveTo(oxph,0);
    ctx.lineTo(oxph,hph);
    
    for (let k=-5; k<=5; k++)
    {
	ctx.moveTo(oxph,oyph+unity*k);
	ctx.lineTo(oxph+5,oyph+unity*k);
    }

    
    ctx.moveTo(0,oyph);
    ctx.lineTo(wph,oyph);
    
    for (let k=-14; k<=14; k++)
    {
	ctx.moveTo(oxph+unity*k,oyph);
	ctx.lineTo(oxph+unity*k,oyph-5);
    }
    
    /*
    ctx.moveTo(ox,h/2);
    ctx.lineTo(w,h/2);*/
    ctx.closePath();
    ctx.stroke();

    for (var i = -2; i <= 2; i++)
    {
	ctx.beginPath();
	ctx.fillStyle="#128323";
	ctx.arc(oxph+unity*2*Math.PI*i, oyph, 3, 0, 2 * Math.PI, false);
	ctx.fill();
    }
    
    //niveaux d'énergie
    ctx.strokeStyle = '#aaaaaa';
    ctx.lineWidth = 1;

    
    
    for (var j=0; j<8; j++)
    {
	
	var i = j/b*1.5;
	plotFunction(ctx, oxph, oyph, unity, unity, function(x) {return Math.sqrt(2*b+2*i*b+2*b*Math.cos(x));}, -14, 14, .1);
	plotFunction(ctx, oxph, oyph, unity, unity, function(x) {return -Math.sqrt(2*b+2*i*b+2*b*Math.cos(x));}, -14, 14, .1);
    }
    
    for (var i=-3; i<3; i++)
    {
	var lim = Math.acos(-i/3);
	//	console.lo
	for (var j = -2; j<=2; j++)
	{

	//     	if (j == 1 && i == 2)
	// {
	//     ctx.strokeStyle = '#aa0000';
	//     ctx.lineWidth = 2;
	// }
	// else
	// {
	//     ctx.strokeStyle = '#aaaaaa';
	//     ctx.lineWidth = 1;
	// }

	    
	    plotFunction(ctx, oxph, oyph, unity, unity, function(x) {return Math.sqrt(.001+2*i*b/3+2*b*Math.cos(x));}, -lim+2*Math.PI*j, lim+2*Math.PI*j, .1);
	    plotFunction(ctx, oxph, oyph, unity, unity, function(x) {return -Math.sqrt(.001+2*i*b/3+2*b*Math.cos(x));}, -lim+2*Math.PI*j, lim+2*Math.PI*j, .1);
	}
    }

    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    ctx.lineWidth = 2;
    let kb = k;
//    console.log(kb);
    var fo2 = function(x,y) {return [y, -a*y-b*Math.sin(x)-l1/100*omega**2*Math.sin(x-omega*kb)];};
    //var fo2 = function(x,y) {return [y, -a*y-b*Math.sin(x)-second_membre(l1, omega, x, kb, b, 1)];};

    
    if (! (is_forced() && !document.getElementById("anec").checked) && !(is_forced() && ! is_animated()))
	plotPhasePortrait(ctx, oxph, oyph, unity, unity, fo2, 1, 1, 20, 10, .8);
    
}


