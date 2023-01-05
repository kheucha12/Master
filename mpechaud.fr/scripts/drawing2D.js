/*
Author: Mickaël Péchaud (m,i,c,k,a,e,l,p,e,c,h,a,u,d,@,g,m,a,i,l,.,c,o,m)
This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
*/


var Draw2D = {
    "drawLine" : function(ctx, p1, p2) {
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.stroke();
    },


    //draws a smooth curve beginning at the first point of l, ending
    //at the last point of l, and using the other points as control
    //points.
    "drawSCurve" : function(ctx, l) {
	ctx.beginPath();
	ctx.moveTo(l[0].x, l[0].y);
	for (var i = 1; i < l.length-2; i++)
	{
	    ctx.quadraticCurveTo(l[i].x, l[i].y, (l[i].x+l[i+1].x)/2, (l[i].y+l[i+1].y)/2);
	}
	var ll = l.length;
	ctx.quadraticCurveTo(l[ll-2].x, l[ll-2].y, l[ll-1].x, l[ll-1].y);
	ctx.stroke();
    },
    
    // "drawCurve" : function(ctx, p1, p2, p3) {
    // 	ctx.beginPath();
    // 	ctx.moveTo(p1.x, p1.y);
    // 	ctx.quadraticCurveTo(p2.x, p2.y, p3.x, p3.y);
    // 	ctx.stroke();
    // },

    
    "drawArrow" : function(ctx, p1, p2, l=5) {
//	this.drawLine(ctx,p1,p2);
//	var l = 5;

	var p0 = new Geom2D.Point(p1.x+10, p1.y);	
	var ang = Geom2D.angle(p2,p1,p0);
	var pl = new Geom2D.Point(p2.x-3*l*Math.cos(ang)+l*Math.cos(ang+Math.PI/2),p2.y-3*l*Math.sin(ang)+l*Math.sin(ang+Math.PI/2));
	var pd = new Geom2D.Point(p2.x-3*l*Math.cos(ang)+l*Math.cos(ang-Math.PI/2),p2.y-3*l*Math.sin(ang)+l*Math.sin(ang-Math.PI/2));
	ctx.beginPath();
	ctx.moveTo(p2.x,p2.y);
	ctx.lineTo(pl.x,pl.y);
	ctx.lineTo(pd.x,pd.y);
	ctx.stroke();
	ctx.fill();
    },
}

