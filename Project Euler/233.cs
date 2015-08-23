using System;

class dkafldjaf
{
	static void Main()
	{
		int cnt = 0;
		double test = 0;
		double range = 0;
		int max = 0;
		for ( int i = 1 ; ; i++)
		{
			//int i = 10000;
			cnt = 0;
			range = (i/1.41421356);
			for ( int j = (int)(i/2.0-range) ; j < 0 ; j++ )
			{
				test = Math.Sqrt(i*i/2.0-(i/2.0-j)*(i/2.0-j))+i/2.0;
				if( test==(double)(int)test)
				{
					//Console.WriteLine(test+","+j);
					cnt++;	
				}
			}
			cnt = (cnt * 2 + 1) * 4;
			//if(cnt == 420)
			//{
			//Console.WriteLine(i);
			//break;
			//}
			//Console.WriteLine(i);
			if( cnt==180 )
			{
				//Console.WriteLine(i + " " + cnt);
				wp(i);
				Console.Write(" | ");
				wp(cnt);
				Console.WriteLine();
				max=cnt;
			}
		}
	}
	static int[] p(int x){
		int check = 0;
		string num = "";
		for (int i = 2 ; x!=1 ; i++)
		{
			if (x%i==0){
				x/=i;
				//Console.Write(" "+i);
				if(check!=i)
				{
					num+=i+" ";
					check = i;
				}
				i--;
			}
		}
		string[] nums = num.Split(' ');
		int[] output = new int[nums.Length-1];
		for( int i = 0 ; i< nums.Length-1 ; i++ )
		{
			output[i] = int.Parse(nums[i]);
		}
		return output;
	}
	static int[] wp(int x){
		int check = 0;
		string num = "";
		for (int i = 2 ; x!=1 ; i++)
		{
			if (x%i==0){
				x/=i;
				Console.Write(" "+i);
				if(check!=i)
				{
					num+=i+" ";
					check = i;
				}
				i--;
			}
		}
		string[] nums = num.Split(' ');
		int[] output = new int[nums.Length-1];
		for( int i = 0 ; i< nums.Length-1 ; i++ )
		{
			output[i] = int.Parse(nums[i]);
		}
		return output;
	}
	static void f(int x){
		for (int i = 1; i<x ; i++)
		{
			if (x%i==0){
				Console.Write(" "+i);
			}
		}
	}
	static bool prime(int x)
	{
		if (x<2)
		{
			return false;
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
	static void factors(int x){
		for (int i = 2 ; x!=1 ; i++)
		{
			if (x%i==0){
				x/=i;
				Console.Write(" "+i);
				i--;
			}
		}
	}
	static double[] quadratic ( double a , double b , double c )
	{
		double[] x = new double[2];
		x[0] = (-b + Math.Sqrt (b*b-4*a*c))/(2*a);
		x[1] = (-b - Math.Sqrt (b*b-4*a*c))/(2*a);
		return x;
	}
}