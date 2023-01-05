var equal=function(a,b,err=10**-6) {
    return Math.abs(a-b)<=err*Math.max(Math.abs(a),Math.abs(b));
};

var equalzero=function(a,err=10**-8) {
    return Math.abs(a)<err;
};
