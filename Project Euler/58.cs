using System;

class dkafldjaf
{
	static void Main()
	{
		int[] corners = new int[100000];
		corners[0] = 1;
		int now = 1;
		int times = 1;
		int cnt = 1;
		for ( int i = 0 ; i <24999 ; i++ )
		{
			for ( int j = 0 ; j<4 ; j++ )
			{
				now += times*2;
				corners[cnt] = now;
				cnt++;
			}
			times++;
		}
		int primecnt = 0;
		cnt = 1;
		times = 0;
		for ( int i = 4 ; i <99999 ; i+=4 )
		{
			//primecnt=0;
			//cnt=0;
			for ( int j = i-3 ; j<=i ; j++)
			{
				if(prime(corners[j])){
					primecnt++;
				} 
				cnt++;
			}
			times ++;
			//Console.WriteLine(primecnt/(double)cnt);
			if(primecnt/(double)cnt<0.1)
			{
				Console.WriteLine(primecnt/(double)cnt);
				Console.WriteLine(i);
				Console.WriteLine(times*2+1);
				break;
			}
			Console.WriteLine(i);
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
}