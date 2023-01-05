/*
Author: Mickaël Péchaud (m,i,c,k,a,e,l,p,e,c,h,a,u,d,@,g,m,a,i,l,.,c,o,m)
This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
*/

function Geom2DException(str) {
    this.data=str;
}


var Geom2D = {

    "Point" : function (x,y) {
    this.x=x;
    this.y=y;
    },

    "Droite" : function(a,b,c) {
    //ax+by=c
    this.a=a;
    this.b=b;
    this.c=c;
    },    
    
    //barycentre
    "bary" : function(p1,p2,lambda) {
	return new Geom2D.Point(lambda*p1.x+(1-lambda)*p2.x, lambda*p1.y+(1-lambda)*p2.y);
    },
    
    
    //egalité de 2 points
    "pointsEqual" : function(p1,p2,err=10**-6) {
	return (equal(p1.x,p2.x,err) && equal(p1.y,p2.y,err))
    },

    //distance entre p1 et p2 
    "dist" : function(p1,p2) {
	return Math.sqrt((p2.x-p1.x)**2+(p2.y-p1.y)**2);
    },

    //distance au carré entre p1 et p2 
    "distsq" : function(p1,p2) {
	return ((p2.x-p1.x)**2+(p2.y-p1.y)**2);
    },

    
    //renvoie un nouveau point éloigné perpendiculairement du barycentre (de paramètre lambda) de [p1,p2] d'une distance algébrique b*|p1p2|.
    "pointcurve": function(p1,p2,lambda,b) {
	if (Geom2D.pointsEqual(p1,p2)) return new Geom2D.Point(p1.x, p1.y);
	var ba = Geom2D.bary(p1,p2,lambda);
	var p0 = new Geom2D.Point(p1.x+10, p1.y);	
	var ang = Geom2D.angle(p2,p1,p0);
	var d = Geom2D.dist(p1,p2);
	return new Geom2D.Point(ba.x-d*b*Math.sin(ang),ba.y+d*b*Math.cos(ang));
    },

    //renvoie le point obtenu par rotation de centre o et d'angle theta
    "rotate" : function(p, o, theta) {
	var dx = p.x-o.x;
	var dy = p.y-o.y;
	var ndx = Math.cos(theta)*dx+Math.sin(theta)*dy;
	var ndy = -Math.sin(theta)*dx+Math.cos(theta)*dy;
	return new Geom2D.Point(o.x+ndx, o.y+ndy);
    },
    
    //donne le représentant dans [0,2pi[ de l'angle p1,p2,p3
    "angle" : function(p1,p2,p3) {
	if (Geom2D.pointsEqual(p1,p2) || Geom2D.pointsEqual(p1,p3))
	    throw "Cannot determine angle of superimposed points";
	var x1=p1.x;
	var x2=p2.x;
	var x3=p3.x;
	var y1=p1.y;
	var y2=p2.y;
	var y3=p3.y;
	var n1=Math.sqrt((x1-x2)**2+(y1-y2)**2);
	var n3=Math.sqrt((x2-x3)**2+(y2-y3)**2);
	var sca=(x1-x2)*(x3-x2)+(y1-y2)*(y3-y2);
	var c=sca/(n1*n3);
	var ang=Math.acos(c);
	if (equalzero(ang) || equal(ang, Math.PI))
	    return ang;
	if (Geom2D.estDirect(p1,p2,p3))
	    return ang;
	else
	    return -ang;
    },

    //donne le représentant dans [0,2pi[ de l'angle entre Ox et p1,p2
    "anglesegment" : function(p1, p2) {
	let p = new Geom2D.Point(p1.x+100, p1.y);
	return Geom2D.angle(p, p1, p2);
    },
    
    
    //point d'intersection de 2 droites
    "intersection" : function(d1,d2) {
	var a1=d1.a;
	var b1=d1.b;
	var c1=d1.c;
	var a2=d2.a;
	var b2=d2.b;
	var c2=d2.c;

	var d=a1*b2-a2*b1;
	if (equalzero(d))
	    throw "Cannot determine unique point : the 2 lines are parallel.";
	return new Geom2D.Point((b2*c1-c2*b1)/d,(c2*a1-a2*c1)/d);
    },
    
    //point M pour compléter AB en un triangle équilatéral ABM
    "complEqui" : function (a,b,direct=true) {
	var xa=a.x;
	var xb=b.x;
	var ya=a.y;
	var yb=b.y;
	if (direct)
	    return new Geom2D.Point((xa+xb)*.5+(ya-yb)*Math.sqrt(3)/2,(ya+yb)*.5+(xb-xa)*Math.sqrt(3)/2);
	else
	    return new Geom2D.Point((xa+xb)*.5+(yb-ya)*Math.sqrt(3)/2,(ya+yb)*.5+(xa-xb)*Math.sqrt(3)/2);
    },
    
    //droite passant par les 2 points donnés
    "droiteParPoints" : function(p1,p2) {
	if (Geom2D.pointsEqual(p1,p2))
	    throw "Cannot determine unique line : the 2 points are superimposed.";
	var x1=p1.x;
	var x2=p2.x;
	var y1=p1.y;
	var y2=p2.y;
	var d=y1*x2-y2*x1;
	var a,b,c;
	if (equalzero(d)) {
	    c=0;
	    if (equalzero(y1))
	    {
		b=1;
		a=0;
	    }
	    else
	    {
		a=1;
		b=-x1/y1;
	    }
	}
	else
	{
	    c=1;
	    a=(y1-y2)/d;
	    b=(x2-x1)/d;
	}
	return new Geom2D.Droite(a,b,c);
    },

    //teste si le triangle p1, p2, p3 est direct
    "estDirect" : function(p1,p2,p3) {
	var x1=p1.x;
	var x2=p2.x;
	var x3=p3.x;
	var y1=p1.y;
	var y2=p2.y;
	var y3=p3.y;
	var d=(x2-x1)*(y3-y1)-(x3-x1)*(y2-y1);
	if (equalzero(d))
	    throw "Triangle is flat.";

	return d>0;
    },
    
    //renvoie le point de fermat du triangle p1, p2, p3, dans le cas où les angles sont tous inférieurs à 2pi/3
    "pointDeFermat" : function(p1,p2,p3) {
	if (!Geom2D.estDirect(p1,p2,p3))
	    return Geom2D.pointDeFermat(p2,p1,p3);
	var pp3=Geom2D.complEqui(p2,p1);
	var pp1=Geom2D.complEqui(p3,p2);
	var d3=Geom2D.droiteParPoints(p3,pp3);
	var d1=Geom2D.droiteParPoints(p1,pp1);
	return Geom2D.intersection(d1,d3);
    },

    "clone" : function(p) {
	return new Geom2D.Point(p.x, p.y);
    },
    
    "centreCercleCirconscrit" : function(p1, p2, p3) {
	var x1 = p2.x - p1.x;
	var y1 = p2.y - p1.y;
	var x2 = p3.x - p1.x;
	var y2 = p3.y - p1.y;
	var d = x1*y2-x2*y1;
	var s1 = (x1**2+y1**2)/2;
	var s2 = (x2**2+y2**2)/2;
	if (equalzero(d))
	{
	    if (Geom2D.pointsEqual(p1, p2))
		return new Geom2D.Point((p1.x+p3.x)/2, (p3.x+p3.y)/2);
	    if (Geom2D.pointsEqual(p1, p3))
		return new Geom2D.Point((p1.x+p2.x)/2, (p2.x+p2.y)/2);
	    if (Geom2D.pointsEqual(p2, p3))
		return new Geom2D.Point((p1.x+p1.x)/2, (p3.x+p3.y)/2);
	    console.log('FFFFAAAAIIIILLLL');
	    return new Geom2DException("Triangle is flat");
	}
	else
	{
	    return new Geom2D.Point(p1.x + (s1*y2-s2*y1)/d , p1.y + (-x2*s1+x1*s2)/d);
	}
    },
    
    //renvoie un résultat >0 Ssi d est dans le cercle circonscrit à a, b, c
    "dansCercleCirconscrit" : function(a,b,c,d) {
	if (!Geom2D.estDirect(a,b,c))
	{
//	    console.log("indirect");
	    let tmp = a;
	    a = b;
	    b = tmp;
	}
	var m = [[1.0*(a.x-d.x), a.y-d.y, a.x**2-d.x**2+a.y**2-d.y**2],
		 [b.x-d.x, b.y-d.y, b.x**2-d.x**2+b.y**2-d.y**2],
		 [c.x-d.x, c.y-d.y, c.x**2-d.x**2+c.y**2-d.y**2]];
	return matrix_det(m);
    },
    
    
}
