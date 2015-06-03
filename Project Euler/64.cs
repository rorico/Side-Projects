using System;
using System.IO;

class dkafldjaf
{
	static void Main()
	{
		int start = 0;
		int denominator = 1;
		int offset = 0;
		//int[] data = new int[1000];
		int[] datadenominator = new int[1000];
		int[] dataoffset = new int[1000];
		int[] datastart = new int[1000];
		int cnt = 0;
		int cnt2 = 0;
		for ( int i = 2 ; i <= 10000 ; i++ )
		{
			start = (int)Math.Sqrt(i);
			denominator = 1;
			offset = 0;
			cnt=0;
			while(true)
			{
				denominator = (i - start * start)/denominator;
				if (denominator == 0)
				{
					break;
				}
				offset = ((int)Math.Sqrt(i) + start)/denominator;
				start = offset * denominator - start;
				//Console.WriteLine(offset);
				//Console.WriteLine(denominator + " " + offset + " " + start );
				if( denominator == datadenominator[0] && offset == dataoffset[0] && start == datastart[0] )
				{
					//data[i] = cnt;
					//Console.WriteLine(i + ". " + cnt);
					if(cnt%2==1)
					{
						cnt2++;
					}
					break;
				}
				datadenominator[cnt] = denominator;
				dataoffset[cnt] = offset;
				datastart[cnt] = start;
				cnt++;
			}
		}
		Console.WriteLine(cnt2);
	}	
}