using System;

class dkafldjaf
{
	static void Main()
	{
		int y = 0;
		int[] x = {0,1,2,3,4,5,6,7,8,9};
		for (int a = 0 ; a<10 ; a++)
		{
			for (int b = 0 ; b<10 ; b++)
			{
				if (b==a)
				{
					continue;
				}
				for (int c = 0 ; c<10 ; c++)
				{
					if (c==a||c==b)
					{
						continue;
					}
					for (int d = 0 ; d<10 ; d++)
					{
						if (d==a||d==b||d==c)
						{
							continue;
						}
						for (int e = 0 ; e<10 ; e++)
						{
							if (e==a||e==b||e==c||e==d)
							{
								continue;
							}
							for (int f = 0 ; f<10 ; f++)
							{
								if (f==a||f==b||f==c||f==d||f==e)
								{
									continue;
								}
								for (int g = 0 ; g<10 ; g++)
								{
									if (g==a||g==b||g==c||g==d||g==e||g==f)
									{
										continue;
									}
									for (int h = 0 ; h<10 ; h++)
									{
										if (h==a||h==b||h==c||h==d||h==e||h==f||h==g)
										{
											continue;
										}
										for (int i = 0 ; i<10 ; i++)
										{
											if (i==a||i==b||i==c||i==d||i==e||i==f||i==g||i==h)
											{
												continue;
											}
											for (int j = 0 ; j<10 ; j++)
											{
												if (j==a||j==b||j==c||j==d||j==e||j==f||j==g||j==h||j==i)
												{
													continue;
												}

												y++;
												if (y==1e6)
												{
													Console.WriteLine("{0}{1}{2}{3}{4}{5}{6}{7}{8}{9} {10}",a,b,c,d,e,f,g,h,i,j,y);
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}		
}