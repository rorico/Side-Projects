using System;
using System.IO;

class dkafldjaf
{
	static void Main()
	{
		int here = 0;
		int cnt = 0;
		int max = 1;
		int limit = 7370050;
		//int limit = 6;
		/*while (max<= 500500507){
		max*=2;
		cnt++;
		}
		Console.WriteLine(cnt);*/
 		for( int i = 2; i<limit ; i++)
		{
			int m = i;
			if( prime(i) ){
			while(true){
			//cnt++;
			//Console.WriteLine(m+" " +max);
			
			//cnt += (int) Math.Log(7368800,i);
			//Console.WriteLine(cnt);
			//for( int k = 1 ; k<= cnt ; k++ ){
			//int number = (int)Math.Pow(m,k);
			int max2 = 0;
			int times = 1646983140/m;
			int times2 = max/times;
			for( int j = 1; j<= times2 ; j++ ){
				max2 = (max2 + times * m)%500500507;
			}
			max2 = (max2 + m * (max-(times*times2)))%500500507;
			//Console.WriteLine(max + " " + times + " " + times2 + " " + m);
			max=max2;
			//Console.WriteLine(cnt);
			//}
			/*cnt = 0;
			for ( int j = 1; j<=i ; j++)
			{
				if ( i%j==0){
					cnt++;
				}
			}
			if (cnt==max*2){
			max=cnt;
			Console.Write(i+" " +cnt+" ");
			p(i);
			Console.WriteLine();
			}*/
			//if(cnt>=500500){
			//Console.WriteLine(i);
			//break;
			//}*/
			if (m > Math.Sqrt(limit)){ break;}
			m = m * m;
			}
			Console.WriteLine(i);
			}
		}
		Console.WriteLine(max);
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
}