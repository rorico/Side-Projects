using System;
using System.IO;

class dkafldjaf
{
	static void Main()
	{
		int times = 99;
		int number = 2;
		int[] sequence = new int[1000];
		sequence[0] = 2;
		for(int i = 1 ; i<200 ; i++)
		{
			if( i%3==2){
				sequence[i] = number;
				number+=2;
			} else {
				sequence[i] = 1;
			}
			//Console.WriteLine(sequence[i]);
		}
		int[] start = new int[100];
		int[] num = new int[100];
		int[] tnp = new int[100];
		c(sequence[times],start);
		num[0] = 1;
		tnp[0] = 0;
		for(int i = times-1 ; i>=0 ; i--)
		{
		//Console.WriteLine(num);
		//Console.WriteLine(start);
			e(tnp,start);
			m(start,sequence[i],num);
			e(num,tnp);
			
		}
		int sum = 0;
		Console.WriteLine(w(start)+" / "+w(num));
		foreach(int number2 in start)
		{
			sum+=number2;
		}
		Console.WriteLine(sum);
	}
	static bool prime(int x)
	{
		if (x<2)
		{
			return true;
		}
		for(int i = 2; i<= (int)Math.Sqrt(x) ; i++)
		{
			if (x%i==0)
			{
				return false;
			}
		}
		return true;
	}
	static void p(int x){
		for (int i = 2 ; x!=1 ; i++)
		{
			if (x%i==0){
				x/=i;
				Console.Write(" "+i);
				i--;
			}
		}
	}
	static void f(int x){
		for (int i = 1; i<x ; i++)
		{
			if (x%i==0){
				Console.Write(" "+i);
			}
		}
	}
	
	static void c( int x , int[] a) //creates number
	{
		string s = Convert.ToString(x);
		for ( int i = s.Length-1 ; i>=0 ; i--)
		{
			a[i] = (int) Char.GetNumericValue(s[s.Length-1-i]);
		}
		for ( int i = s.Length ; i<a.Length ; i++)
		{
			a[i] = 0 ;
		}
	}
	static void m( int[] x , int y, int[] z ) //multiply, then add
	{
		for ( int i = x.Length-1 ; i>=0 ; i-- )
		{
			x[i]=x[i]*y+z[i];
			a(x,i);
		}
	}
	static void a( int[] x , int y ) //converts number>10 to proper
	{
		string s = Convert.ToString(x[y]);
		x[y] = x[y]%10;
		for ( int i = 1 ; i < s.Length; i++)
		{
			x[y+i] = x[y+i]+ (int) Char.GetNumericValue(s[s.Length-1-i]);
			d(x,y+i);
		}
	}
	static void d( int[] x , int y ) // helps a() with carrying
	{
		if ( x[y] >= 10 )
		{
			x[y+1] = x[y+1] + x[y]/10;
			x[y] = x[y]%10;
			y++;
			d(x,y);
		}
	}
	static string w( int[]x ) //write out array
	{
		string number = "";
		int check = 0;
		for ( int i = x.Length-1 ; i>=0 ; i-- )
		{
			if(check==0&&x[i]!=0)
			{
				check++;
				number += x[i].ToString();
			} else if (check!=0) {
				number += x[i].ToString();
			}
		}
		return number;
	}
	static void e( int[] x , int[] z ) //make x = z
	{
		for ( int i = x.Length-1 ; i>=0 ; i-- )
		{
			x[i] = z[i];
		}
	}
}