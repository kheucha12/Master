/*
Author: Mickaël Péchaud (m,i,c,k,a,e,l,p,e,c,h,a,u,d,@,g,m,a,i,l,.,c,o,m)
This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
*/



/*var absToCanvasCoordinates = function(ox, oy, ux, uy, x, y)
{
    return [ox+ux*x, oy+uy*y];
}
*/
//ctx: context
//canvas
//ox, oy : origin
//ux, uy : unities
//f : array OR function
//disc : discontinuity detection
var plotFunction = function(ctx, ox, oy, ux, uy, f, xmin, xmax, step, disc=-1){
    ctx.beginPath();
    if (typeof f == "function") 
    {
	//var p0 = absToCanvasCoordinates(ox, oy, ux, uy, xmin, f(xmin));
	ctx.moveTo(ox+ux*xmin, oy+uy*f(xmin));

	var oldy = f(xmin);
	var n = (xmax - xmin)/step;
	
	for (var k = 1; k < n+1; k++)
	{
	    //	    var p = absToCanvasCoordinates(ox, oy, ux, uy, xmin+k*step, f(Math.min(xmin+k*h, xmax)));
	    var y = f(Math.min(xmin+k*step,xmax));
	    if (disc !== -1 && Math.abs(y-oldy) > disc)
	    {
//		ctx.stroke();
//		ctx.beginPath();
		ctx.moveTo(ox+ux*Math.min(xmin+k*step,xmax), oy+uy*y);
//		console.log('pouet '+y+" "+oldy);
	    }
	    else
		ctx.lineTo(ox+ux*Math.min(xmin+k*step,xmax), oy+uy*y);
	    oldy = y;
	}
	
    }
    else //array
    {
//	var p0 = absToCanvasCoordinates(ox, oy, ux, uy, xmin, f[0]);
//	ctx.moveTo(p0[0], p0[1]);
	ctx.moveTo(ox+ux*xmin, oy+uy*f[0]);
	for (var k = 1; k < f.length; k++)
	{
//	    var p = absToCanvasCoordinates(ox, oy, ux, uy, xmin+k*step, f[k]);
	    //	    ctx.lineTo(p[0], p[1]);
	    ctx.lineTo(ox+ux*Math.min(xmin+k*step,xmax), oy+uy*f[k]);

	}
    }
    ctx.stroke();
}




var plotBars = function(ctx, ox, oy, ux, uy, f, xmin, step, w){
    ctx.beginPath();
    // ctx.moveTo(ox+ux*xmin, oy+uy*f[0]);
    for (var k = 0; k < f.length; k++)
    {
	ctx.rect(ox+ux*(xmin+k*step)-w/2, oy-1, w, -uy*f[k]);
	ctx.stroke();
	ctx.fill();
    }
//    ctx.stroke();
}


var plotPhasePortrait = function(ctx, ox, oy, ux, uy, f, stepx, stepy, nbx=10, nby=10, normalize=1) {

//    console.log(f(2,3));
    
    
    for (let i = -nbx; i <= nbx; i++)
	for (let j = -nby; j <= nby; j++)
    {
	let cx = i*stepx;
	let cy = j*stepy;
	let vec = f(cx, cy);
	if (normalize)
	{
	    let norme = Math.sqrt(vec[0]**2+vec[1]**2);
	    if (equalzero(norme))
	    {
		continue;
	    }
	    else
	    {
		vec[0] /= norme/normalize;
		vec[1] /= norme/normalize;
	    }
	}
	let pd = new Geom2D.Point(ox+ux*cx, oy-uy*cy);
	let pa = new Geom2D.Point(ox+ux*(cx+vec[0]), oy-uy*(cy+vec[1]));
/*	console.log(pd.x, pd.y);
	console.log(pa.x, pa.y);*/
	Draw2D.drawLine(ctx, pd, pa);
	if (normalize)
	    Draw2D.drawArrow(ctx, pd, pa, 4*normalize);
	else
	    Draw2D.drawArrow(ctx, pd, pa, 5);
    }
    
}
