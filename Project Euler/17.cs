using System;

class dkafldjaf
{
	static void Main()
	{
		int x = 0;
		for (int i = 1 ; i<1000 ; i++)
		{
			if 	(i<20)
			{
				if (i==1||i==2||i==6||i==10)
				{
					x+=3;
				}else if(i==3||i==7||i==8){
					x+=5;
				}else if(i==4||i==5||i==9){
					x+=4;
				}else if (i==11||i==12){
					x+=6;
				}else if (i==13||i==14||i==18||i==19){
					x+=8;
				}else if (i==15||i==16){
					x+=7;
				}else if (i==17){
					x+=9;
				}
			}else if (i<100){
				string s = Convert.ToString(i);
				char[] b = s.ToCharArray();
				if (b[0]=='2'||b[0]=='3'||b[0]=='8'||b[0]=='9')
				{
					x+=6;
				}else if (b[0]=='4'||b[0]=='5'||b[0]=='6'){
					x+=5;
				}else if (b[0]=='7'){
					x+=7;
				}
				if (b[1]=='1'||b[1]=='2'||b[1]=='6')
				{
					x+=3;
				}else if(b[1]=='3'||b[1]=='7'||b[1]=='8'){
					x+=5;
				}else if(b[1]=='4'||b[1]=='5'||b[1]=='9'){
					x+=4;
				}
			} else {
				string s = Convert.ToString(i);
				char[] b = s.ToCharArray();
				if (b[0]=='1'||b[0]=='2'||b[0]=='6')
				{
					x+=3;
				}else if(b[0]=='3'||b[0]=='7'||b[0]=='8'){
					x+=5;
				}else if(b[0]=='4'||b[0]=='5'||b[0]=='9'){
					x+=4;
				}
				if ((b[1]-'0')>=2)
				{
					if (b[1]=='2'||b[1]=='3'||b[1]=='8'||b[1]=='9')
					{
						x+=6;
					}else if (b[1]=='4'||b[1]=='5'||b[1]=='6'){
						x+=5;
					}else if (b[1]=='7'){
						x+=7;
					}
					if (b[2]=='1'||b[2]=='2'||b[2]=='6')
					{
						x+=3;
					}else if(b[2]=='3'||b[2]=='7'||b[2]=='8'){
						x+=5;
					}else if(b[2]=='4'||b[2]=='5'||b[2]=='9'){
						x+=4;
					}
					Console.WriteLine("{0} {1}",i,x);
				}else{
					int w = 10*(b[1]-'0')+1*(b[2]-'0');
					if (w==1||w==2||w==6||w==10)
					{
						x+=3;
					}else if(w==3||w==7||w==8){
						x+=5;
					}else if(w==4||w==5||w==9){
						x+=4;
					}else if (w==11||w==12){
						x+=6;
					}else if (w==13||w==14||w==18||w==19){
						x+=8;
					}else if (w==15||w==16){
						x+=7;
					}else if (w==17){
						x+=9;
					}
					if (w==0)
					{
						x-=3;
					}
					//Console.WriteLine("{0} {1}",i,w);
				}
				x+=10;
				
			}

		}
		Console.WriteLine(x+11);
	}		
}