using System;

class dkafldjaf
{
	static void Main()
	{
		int a = 0;
		int x = 0;
		int b = 5;
		int c = 0;
		int y = 0;
		int d = 5;
		int[] o = {31,28,31,30,31,30,31,31,30,31,30,31}; 
		for (int i = 1901 ; i <= 2000 ; i++)
		{
			if (i%4==0)
			{
				x = 366;
				o[1] = 29;
			}else{
				x = 365;
				
			}
			for ( int j = 0 ; j < x ; j++)
			{
				a = j;
				c=0;
				while (a >= (o[c]))
				{
				Console.WriteLine("{0} {1}", a, c);
					a-=o[c];
					c++;
				}

				
				if (((j-b)%7==0)&&(a==0))
				{
					y++;
				}
			}
			d+=x;
			b=d%7;
			c=0;
		}
		Console.WriteLine(y);
	}		
}