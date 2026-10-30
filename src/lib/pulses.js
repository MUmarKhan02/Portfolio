// Background grid effects: glowing streaks that travel along the grid lines and dot rows,
// plus the cursor-lit grid. Ported from the original single-file script; the drawing math is unchanged.
// createPulses(canvas) returns { setStreaks(bool), destroy() }.
export function createPulses(cv) {
  if (!cv || !cv.getContext) return { setStreaks() {}, destroy() {} };

  var reduce=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches);
  var ctx=cv.getContext('2d'),N=24,SQ=Math.SQRT2,dpr=1,vw=0,vh=0,regions=[],pulses=[],last=0,nextSpawn=0,col=null,F=56,cur={x:0,y:0,tx:0,ty:0,i:0,on:false},coarse=window.matchMedia&&window.matchMedia('(pointer:coarse)').matches,gdv=1,gdSet=1;
  var destroyed=false,raf=0,rafOn=false,streaksOn=false,measureTimer=0,ro=null,cleanups=[];
  /* every listener goes through on() so destroy() can remove it (React may mount/unmount this) */
  function on(t,ev,fn,opt){t.addEventListener(ev,fn,opt);cleanups.push(function(){t.removeEventListener(ev,fn,opt)})}
  /* phone layout (<=760px, the same breakpoint where the page goes single-column): streaks are switched off entirely, they cross the text and clutter small screens */
  var phoneMQ=window.matchMedia('(max-width:760px)');
  function streaksActive(){return streaksOn&&!phoneMQ.matches}
  function kick(){if(!rafOn&&!destroyed){rafOn=true;raf=requestAnimationFrame(frame)}}
  function onPhone(){if(phoneMQ.matches)pulses=[];kick()}
  on(phoneMQ,'change',onPhone);
  var secs=[].slice.call(document.querySelectorAll('section.alt'));
  var DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
  function rnd(a,b){return a+Math.random()*(b-a)}
  function layout(){
    dpr=Math.min(window.devicePixelRatio||1,2);vw=document.documentElement.clientWidth;vh=window.innerHeight;
    cv.width=Math.round(vw*dpr);cv.height=Math.round(vh*dpr);
    var y=window.scrollY||window.pageYOffset;
    regions=secs.map(function(s){var t=Math.round(s.getBoundingClientRect().top+y)+s.clientTop;return[t,t+s.clientHeight]});
    measureText();
  }
  /* text keep-out: every line of text gets a soft mask so streaks fade out behind it and never cut through words */
  var rects=[],blocks=[],heroBand=null;
  function measureText(){
    var y=window.scrollY||window.pageYOffset,out=[],r=document.createRange(),
    tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
      if(!/\S/.test(n.nodeValue))return NodeFilter.FILTER_REJECT;
      var el=n.parentElement;if(!el||el.closest('script,style,canvas,nav,.split>h2'))return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT}});
    while(tw.nextNode()){
      r.selectNodeContents(tw.currentNode);
      var cl=r.getClientRects();
      for(var i=0;i<cl.length;i++){var c=cl[i];if(c.width>2&&c.height>2)out.push([c.left,c.top+y,c.right,c.bottom+y])}
    }
    rects=out;
    /* main content (right-hand column) of every section except the hero: one solid band from the top to the bottom of the section, so streaks fade out as they reach
       the column and never slip through the gaps between paragraphs. The empty left column (where only the title sits) stays free. */
    var bl=[];
    [].forEach.call(document.querySelectorAll('section .split'),function(s){
      if(s.closest('.hero'))return;
      var t2=s.querySelector(':scope>h2'),tr2=t2?t2.getBoundingClientRect():null,left=1e9,any=false;
      [].forEach.call(s.children,function(ch){
        if(ch.tagName==='H2')return;
        var q=ch.getBoundingClientRect();
        if(tr2&&q.left<tr2.right-2)return; /* stacked (phone) layout: the title sits above the content, so only the text lines themselves are masked */
        if(q.width>40&&q.height>8){any=true;if(q.left<left)left=q.left}
      });
      if(!any)return;
      var sq=s.getBoundingClientRect(),sec=s.closest('section'),vq=sec?sec.getBoundingClientRect():sq;
      bl.push([left,vq.top+y,sq.right,vq.bottom+y]);
    });
    blocks=bl;
    var hero=document.querySelector('.hero'),w=document.querySelector('.hero .wrap');
    if(hero&&w){var q=w.getBoundingClientRect(),hq=hero.getBoundingClientRect();col=q.left>=70?[q.left,q.right]:null;heroBand=[hq.top+y,hq.bottom+y]}else{col=null;heroBand=null}
  }
  function isDot(y){for(var i=0;i<regions.length;i++)if(y>=regions[i][0]&&y<=regions[i][1])return true;return false}
  /* is the step from (x,y) in direction (dx,dy) allowed? grid regions: only along drawn grid lines; dot regions: any of 8 directions */
  function valid(x,y,dx,dy){
    var ny=y+dy*N;
    if(dx&&dy)return isDot(y)&&isDot(ny);
    if(!dy)return isDot(y)||y%(2*N)===0;
    return x%(2*N)===0||(isDot(y)&&isDot(ny));
  }
  function rgbOf(v){var s=getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    if(s.charAt(0)==='#'&&s.length===7)return[parseInt(s.substr(1,2),16),parseInt(s.substr(3,2),16),parseInt(s.substr(5,2),16)];return[110,168,255]}
  function pick(list){var t=0,i;for(i=0;i<list.length;i++)t+=list[i][2];var r=Math.random()*t;
    for(i=0;i<list.length;i++){r-=list[i][2];if(r<=0)return list[i]}return list[list.length-1]}
  function spawn(sy,tm){
    for(var tries=0;tries<40;tries++){
      var side=Math.floor(rnd(0,4)),x,y,c=[];
      if(side<2){x=side?N*Math.floor(vw/N):0;y=2*N*Math.round((sy+rnd(0,vh))/(2*N))}
      else{x=2*N*Math.floor(rnd(0,vw/(2*N)));y=side===2?N*Math.round(sy/N):N*Math.round((sy+vh)/N)}
      DIRS.forEach(function(d){
        var inward=side===0?d[0]>0:side===1?d[0]<0:side===2?d[1]>0:d[1]<0;
        if(inward&&valid(x,y,d[0],d[1]))c.push([d[0],d[1],(d[0]&&d[1])?1:2]);
      });
      if(!c.length)continue;
      var d=pick(c),light=document.documentElement.getAttribute('data-theme')==='light',
          egg=Math.random()<.07&&!pulses.some(function(q){return q.egg}); /* easter egg: about 7% of streaks are the special blue-to-lavender gradient one */
      pulses.push({ox:x,oy:y,age:0,x:x,y:y,dx:d[0],dy:d[1],pts:[{x:x,y:y,s:0,dx:d[0],dy:d[1]}],sNode:0,sh:0,st:0,dist:0,
        maxDist:rnd(1800,3200),L:egg?rnd(460,640):rnd(300,500),v:egg?rnd(250,330):rnd(220,320),fade:false,phase:rnd(0,6.28),egg:egg,
        rgb0:egg?(light?[36,76,205]:[120,170,255]):null,rgb:egg?(light?[112,60,214]:[226,214,255]):rgbOf(Math.random()<.6?'--accent':'--violet'),a:egg?(light?.9:1):(light?.7:.95)});
      return;
    }
  }
  function len(dx,dy){return(dx&&dy)?N*SQ:N}
  function step(p,dt){
    p.age+=dt;
    if(!p.fade&&p.age>14)p.fade=true;
    if(!p.fade){
      p.sh+=p.v*dt;p.dist+=p.v*dt;
      while(p.sh>=p.sNode+len(p.dx,p.dy)){
        p.sNode+=len(p.dx,p.dy);p.x+=p.dx*N;p.y+=p.dy*N;
        var sy=window.scrollY||0,out=p.x<-40||p.x>vw+40||p.y<sy-40||p.y>sy+vh+40;
        if(p.dist>p.maxDist||out){p.fade=true;p.sh=p.sNode;p.pts.push({x:p.x,y:p.y,s:p.sNode,dx:p.dx,dy:p.dy});break}
        var c=[];
        DIRS.forEach(function(d){
          if(d[0]!==p.dx||d[1]!==p.dy)return; /* never turn */
          if(!valid(p.x,p.y,d[0],d[1]))return;
          var nx=p.x+d[0]*N,ny=p.y+d[1]*N,sy2=window.scrollY||0;
          if(p.age<2.5&&(nx<0||nx>vw||ny<sy2||ny>sy2+vh))return;
          var same=d[0]===p.dx&&d[1]===p.dy;c.push([d[0],d[1],same?40:1]);
        });
        if(!c.length){p.fade=true;p.sh=p.sNode;p.pts.push({x:p.x,y:p.y,s:p.sNode,dx:p.dx,dy:p.dy});break}
        var d=pick(c);p.dx=d[0];p.dy=d[1];p.pts.push({x:p.x,y:p.y,s:p.sNode,dx:p.dx,dy:p.dy});
      }
      p.st=Math.max(0,p.sh-p.L);
    }else{p.st+=p.v*1.2*dt;if(p.st>=p.sh-1)p.dead=true}
    while(p.pts.length>2&&p.pts[1].s<=p.st)p.pts.shift();
  }
  function at(p,s){
    var a=p.pts,i=a.length-1;while(i>0&&a[i].s>s)i--;
    var n=a[i],t=(s-n.s)/len(n.dx,n.dy);if(t<0)t=0;return[n.x+n.dx*N*t,n.y+n.dy*N*t];
  }
  function draw(p,sy,time){
    var span=p.sh-p.st;if(span<2)return;
    var K=Math.max(4,Math.min(30,Math.ceil(span/8))),fin=1,fl=.88+.12*Math.sin(time*16+p.phase);
    var prev=at(p,p.st),c=p.rgb;ctx.lineCap='butt';ctx.lineWidth=p.egg?4.4:3.2;
    for(var k=1;k<=K;k++){
      var u=k/K,pt=at(p,p.st+span*u);
      var ca=(p.a*fin*fl*Math.pow(u,p.egg?1.3:1.8)).toFixed(3),cc=c;
      if(p.egg){var q=p.rgb0;cc=[Math.round(q[0]+(c[0]-q[0])*u),Math.round(q[1]+(c[1]-q[1])*u),Math.round(q[2]+(c[2]-q[2])*u)]; /* tail is blue, head is lavender */
        ctx.lineWidth=14;ctx.strokeStyle='rgba('+cc[0]+','+cc[1]+','+cc[2]+','+(ca*.13).toFixed(3)+')';
        ctx.beginPath();ctx.moveTo(prev[0]+.5,prev[1]+.5-sy);ctx.lineTo(pt[0]+.5,pt[1]+.5-sy);ctx.stroke();ctx.lineWidth=4.4}
      ctx.strokeStyle='rgba('+cc[0]+','+cc[1]+','+cc[2]+','+ca+')';
      ctx.beginPath();ctx.moveTo(prev[0]+.5,prev[1]+.5-sy);ctx.lineTo(pt[0]+.5,pt[1]+.5-sy);ctx.stroke();prev=pt;
    }
    if(p.age<.45){var u=p.age/.45;
      ctx.fillStyle='rgba('+c[0]+','+c[1]+','+c[2]+','+((p.egg?.6:.45)*(1-u)).toFixed(3)+')';
      ctx.beginPath();ctx.arc(p.ox+.5,p.oy+.5-sy,10+u*(p.egg?150:60),0,6.283);ctx.fill();
    }
    if(p.egg&&p.age<.9){var w=p.age/.9;
      ctx.strokeStyle='rgba('+c[0]+','+c[1]+','+c[2]+','+(.55*(1-w)).toFixed(3)+')';ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(p.ox+.5,p.oy+.5-sy,16+w*190,0,6.283);ctx.stroke();ctx.lineWidth=4.4;
    }
    if(!p.fade){
      ctx.shadowColor='rgba('+c[0]+','+c[1]+','+c[2]+',.9)';ctx.shadowBlur=p.egg?42:24;
      ctx.fillStyle='rgba('+c[0]+','+c[1]+','+c[2]+','+Math.min(1,p.a*fin*fl*1.25).toFixed(3)+')';
      ctx.beginPath();ctx.arc(prev[0]+.5,prev[1]+.5-sy,p.egg?6.5:4.4,0,6.283);ctx.fill();ctx.shadowBlur=0;
      if(p.egg){var hx=prev[0]+.5,hy=prev[1]+.5-sy,sp=15+5*Math.sin(time*14+p.phase);
        ctx.lineWidth=1.4;ctx.strokeStyle='rgba('+c[0]+','+c[1]+','+c[2]+','+(.75*fl).toFixed(3)+')';
        ctx.beginPath();ctx.moveTo(hx-sp,hy);ctx.lineTo(hx+sp,hy);ctx.moveTo(hx,hy-sp);ctx.lineTo(hx,hy+sp);ctx.stroke();ctx.lineWidth=4.4}
    }
  }
  /* cursor illumination: near the pointer the grid lines light up (night) or deepen (day), intersections spark with a small +, and the dot matrix brightens.
     Drawn behind the text (the canvas sits under the content), and dimmed right at the words so reading is never hurt. */
  if(!coarse&&!reduce){
    on(document,'mousemove',function(e){cur.tx=e.clientX;cur.ty=e.clientY;if(!cur.on){cur.x=cur.tx;cur.y=cur.ty}cur.on=true;kick()},{passive:true});
    on(document.documentElement,'mouseleave',function(){cur.on=false});
  }
  function gridStrips(sy){
    var out=[],pos=sy-2,end=sy+vh+2,rs=regions.slice().sort(function(a,b){return a[0]-b[0]});
    rs.forEach(function(r){if(r[1]<pos||r[0]>end)return;if(r[0]>pos)out.push([pos,Math.min(r[0],end)]);pos=Math.max(pos,r[1])});
    if(pos<end)out.push([pos,end]);return out;
  }
  function drawCursor(sy,light){
    if(cur.i<.02)return;
    var i=cur.i*(light?.55:.75),R=200,cx=cur.x,cy=cur.y,py=cy+sy,c=light?[84,58,190]:[176,190,255];
    function col(a){return'rgba('+c[0]+','+c[1]+','+c[2]+','+Math.max(0,a).toFixed(3)+')'}
    var hg=ctx.createRadialGradient(cx,cy,0,cx,cy,R*1.15);hg.addColorStop(0,col((light?.10:.09)*i));hg.addColorStop(1,col(0));
    ctx.fillStyle=hg;ctx.fillRect(cx-R*1.15,cy-R*1.15,R*2.3,R*2.3);
    var k0=Math.ceil((cx-R-.5)/48),k1=Math.floor((cx+R-.5)/48),j0=Math.ceil((py-R-.5)/48),j1=Math.floor((py+R-.5)/48);
    gridStrips(sy).forEach(function(st){
      var top=st[0]-sy,bot=st[1]-sy;if(bot<cy-R||top>cy+R)return;
      ctx.save();ctx.beginPath();ctx.rect(0,top,vw,bot-top);ctx.clip();ctx.lineWidth=1.3;ctx.lineCap='butt';
      for(var k=k0;k<=k1;k++){var x=k*48+.5,dx=Math.abs(x-cx);if(dx>=R)continue;
        var h=Math.sqrt(R*R-dx*dx),g=ctx.createLinearGradient(0,cy-h,0,cy+h);
        g.addColorStop(0,col(0));g.addColorStop(.5,col(.7*i*(1-dx/R)));g.addColorStop(1,col(0));
        ctx.strokeStyle=g;ctx.beginPath();ctx.moveTo(x,cy-h);ctx.lineTo(x,cy+h);ctx.stroke()}
      for(var j=j0;j<=j1;j++){var yv=j*48+.5-sy,dy=Math.abs(yv-cy);if(dy>=R)continue;
        var w=Math.sqrt(R*R-dy*dy),g2=ctx.createLinearGradient(cx-w,0,cx+w,0);
        g2.addColorStop(0,col(0));g2.addColorStop(.5,col(.7*i*(1-dy/R)));g2.addColorStop(1,col(0));
        ctx.strokeStyle=g2;ctx.beginPath();ctx.moveTo(cx-w,yv);ctx.lineTo(cx+w,yv);ctx.stroke()}
      /* + sparks on the line crossings */
      var RS=R*.78;ctx.lineWidth=1.4;
      for(k=k0;k<=k1;k++)for(j=j0;j<=j1;j++){
        var X=k*48+.5,Y=j*48+.5-sy,d=Math.sqrt((X-cx)*(X-cx)+(Y-cy)*(Y-cy));if(d>=RS||Y<top-6||Y>bot+6)continue;
        var f=1-d/RS,L=3+6*f;ctx.strokeStyle=col(.95*f*i);
        ctx.beginPath();ctx.moveTo(X-L,Y);ctx.lineTo(X+L,Y);ctx.moveTo(X,Y-L);ctx.lineTo(X,Y+L);ctx.stroke()}
      ctx.restore();
    });
    /* dot matrix on the shaded sections */
    var a0=Math.ceil((cx-R)/N),a1=Math.floor((cx+R)/N),b0=Math.ceil((py-R)/N),b1=Math.floor((py+R)/N);
    for(var a=a0;a<=a1;a++)for(var b=b0;b<=b1;b++){
      var DX=a*N+.5,DY=b*N+.5;if(!isDot(DY))continue;
      var dd=Math.sqrt((DX-cx)*(DX-cx)+(DY-py)*(DY-py));if(dd>=R)continue;
      var ff=1-dd/R;ctx.fillStyle=col((.1+.75*ff*ff)*i);
      ctx.beginPath();ctx.arc(DX,DY-sy,1.1+1.7*ff,0,6.283);ctx.fill();
    }
    /* soften what sits directly behind words */
    ctx.globalCompositeOperation='destination-out';ctx.fillStyle='rgba(0,0,0,.5)';
    for(var q=0;q<rects.length;q++){var r=rects[q],t2=r[1]-sy,b2=r[3]-sy;
      if(b2<cy-R||t2>cy+R||r[2]<cx-R||r[0]>cx+R)continue;
      ctx.fillRect(r[0]-4,t2-3,r[2]-r[0]+8,b2-t2+6)}
    ctx.globalCompositeOperation='source-over';
  }
  function frame(ts){
    if(destroyed)return;
    var t=ts/1000,dt=Math.min(.05,t-last||.016);last=t;
    var sy=Math.round((window.scrollY||0)*dpr)/dpr,target=vw<=760?4:8;
    pulses=pulses.filter(function(p){
      if(p.dead)return false;
      var hy=p.y+p.dy*N*Math.max(0,Math.min(1,(p.sh-p.sNode)/len(p.dx,p.dy))),ty=at(p,p.st)[1];
      return!((hy<sy-30&&ty<sy-30)||(hy>sy+vh+30&&ty>sy+vh+30));
    });
    if(streaksActive()&&pulses.length<target&&t>nextSpawn){spawn(sy,t);nextSpawn=t+rnd(.2,.7)}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,vw,vh);
    pulses.forEach(function(p){step(p,dt);if(!p.dead)draw(p,sy,t)});
    ctx.globalCompositeOperation='destination-out';
    for(var i=0;i<rects.length;i++){
      var q=rects[i],top=q[1]-sy,bot=q[3]-sy;if(bot<-20||top>vh+20)continue;
      ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(q[0]-14,top-9,q[2]-q[0]+28,bot-top+18);
      ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(q[0]-7,top-5,q[2]-q[0]+14,bot-top+10);
      ctx.fillStyle='rgba(0,0,0,.95)';ctx.fillRect(q[0]-3,top-2,q[2]-q[0]+6,bot-top+4);
    }
    /* sticky section titles move with the scroll, so their text is measured every frame */
    [].forEach.call(document.querySelectorAll('.split>h2'),function(t){
      var tr=t.getBoundingClientRect();if(tr.bottom<-20||tr.top>vh+20)return;
      var rg=document.createRange();rg.selectNodeContents(t);
      [].forEach.call(rg.getClientRects(),function(c){
        if(c.width<2)return;
        ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(c.left-14,c.top-9,c.width+28,c.height+18);
        ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(c.left-7,c.top-5,c.width+14,c.height+10);
        ctx.fillStyle='rgba(0,0,0,.95)';ctx.fillRect(c.left-3,c.top-2,c.width+6,c.height+4);
      });
    });
    function fadeBox(l,r,t,hgt){
      var gl=ctx.createLinearGradient(l-F,0,l,0);gl.addColorStop(0,'rgba(0,0,0,0)');gl.addColorStop(1,'rgba(0,0,0,1)');
      ctx.fillStyle=gl;ctx.fillRect(l-F,t,F,hgt);
      ctx.fillStyle='#000';ctx.fillRect(l,t,r-l,hgt);
      var gr=ctx.createLinearGradient(r,0,r+F,0);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=gr;ctx.fillRect(r,t,F,hgt);
    }
    for(var bi=0;bi<blocks.length;bi++){
      var bb=blocks[bi],bt=bb[1]-sy,bh=bb[3]-bb[1];if(bt+bh<-20||bt>vh+20)continue;
      fadeBox(bb[0],bb[2],bt,bh);
    }
    if(col&&heroBand){var ht=heroBand[0]-sy,hh=heroBand[1]-heroBand[0];if(ht+hh>0&&ht<vh)fadeBox(col[0],col[1],ht,hh)}
    ctx.globalCompositeOperation='source-over';
    cur.i+=((cur.on?1:0)-cur.i)*Math.min(1,dt*6);cur.x+=(cur.tx-cur.x)*Math.min(1,dt*16);cur.y+=(cur.ty-cur.y)*Math.min(1,dt*16);
    drawCursor(sy,document.documentElement.getAttribute('data-theme')==='light');
    /* text contact: the nearer the pointer is to words, the more the glow eases off (CSS reads --gd); firmer in day mode (floor .25) than night (floor .6) */
    var tgt=1;
    if(cur.on){
      var gx=cur.x,gy=cur.y+sy,md=1e9;
      for(var m=0;m<rects.length;m++){var rr=rects[m],ddx=Math.max(rr[0]-gx,0,gx-rr[2]),ddy=Math.max(rr[1]-gy,0,gy-rr[3]),dm=ddx*ddx+ddy*ddy;if(dm<md)md=dm}
      var fl=document.documentElement.getAttribute('data-theme')==='light'?.25:.6;
      tgt=fl+(1-fl)*Math.min(1,Math.sqrt(md)/44);
    }
    gdv+=(tgt-gdv)*Math.min(1,dt*9);
    if(Math.abs(gdv-gdSet)>.02){document.documentElement.style.setProperty('--gd',gdv.toFixed(2));gdSet=gdv}
    /* nothing left to draw (streaks off, pointer away): stop the loop entirely until something wakes it */
    if(!streaksActive()&&pulses.length===0&&!cur.on&&cur.i<.02&&Math.abs(gdv-1)<.03){rafOn=false;return}
    raf=requestAnimationFrame(frame);
  }
  layout();
  on(window,'resize',layout);on(window,'load',layout);
  if(window.ResizeObserver){ro=new ResizeObserver(layout);ro.observe(document.body)}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){if(!destroyed)layout()});
  measureTimer=setInterval(measureText,2000);
  kick();

  return {
    /* streak toggle: the on/off state is owned by React; turning it off clears whatever is on screen */
    setStreaks:function(v){streaksOn=!!v;if(!streaksOn)pulses=[];kick()},
    destroy:function(){
      destroyed=true;cancelAnimationFrame(raf);clearInterval(measureTimer);
      if(ro)ro.disconnect();
      cleanups.forEach(function(f){f()});cleanups=[];
      ctx.clearRect(0,0,cv.width,cv.height);
    }
  };
}
