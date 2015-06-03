using System;

class dkafldjaf
{
	static void Main()
	{
		int sum = 0 ;
		int[] a = new int[607];
		a[0]=1;
		for (int i = 1; i<607 ; i++)
		{
		a[i]=0;
		}
		for (int i = 0; i<1000; i++)
		{
			for (int j = 605 ; j>=0; j--)
			{
				if (a[j]==0)
				{
					continue;
				}
				int x = 2*a[j];
				Console.WriteLine("{0} {1}",x,a[j]);
				if (x>=10)
				{
					a[j+1]=a[j+1]+1;
					a[j]=x-10;
				}else{
					a[j]=x;
				}
			}
		}
		for (int i = 0 ; i<607; i++)
		{
			sum+=a[i];
			if(a[i]!=0)
			{
			Console.Write("{0} ",a[i]);
			}
		}
		Console.WriteLine(sum);

//		Console.WriteLine(x+11);
	}		
}