using System;

class dkafldjaf
{
	static void Main()
	{
		int x = 0; 
		int y = 0;
		for ( int a = 0 ; a<=2 ; a++)
		{	
			for ( int b = 0 ; b<=4 ; b++)
			{
				for ( int c = 0 ; c<=5 ; c++)
				{
					for ( int d = 0 ; d<=11 ; d++)
					{
						for ( int e = 0 ; e<=20 ; e++)
						{
							for ( int f = 0 ; f<=51 ; f++)
							{
								for ( int g = 0 ; g<=100 ; g++)
								{
									for ( int h = 0 ; h<=200 ; h++)
									{
										x = a*200+b*100+c*50+d*20+e*10+f*5+g*2+h*1;
										if (x==200)
										{
											y++;
											Console.WriteLine("{0} {1} {2} {3} {4} {5} {6} {7}",a,b,c,d,e,f,g,h);
										}
									}
								}
							}
						}
					}
				}
			}
		}
		Console.WriteLine(y);
	}		
}