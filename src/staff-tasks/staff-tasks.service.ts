import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { StaffTask } from './entity/staff-task.entity';

@Injectable()
export class StaffTaskService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<StaffTask[]> {
    return this.prisma.staffTask.findMany({
      include: {
        user: true,
        task: {
          include: {
            checkQualities: {
              include: {
                orderDetail: {
                  include: {
                    order: true,
                    design: true
                  }
                },
                factoryOrderDetail: {
                  include: {
                    factoryOrder: true,
                    design: {
                      include: {
                        user: true,
                        systemConfigVariant: true
                      }
                    },
                    orderDetail: true
                  }
                }
              }
            },
            staffTasks: {
              include: {
                user: true,
                task: {
                  include: {
                    checkQualities: {
                      include: {
                        orderDetail: {
                          include: {
                            order: true,
                            design: true
                          }
                        },
                        factoryOrderDetail: {
                          include: {
                            factoryOrder: true,
                            design: {
                              include: {
                                user: true,
                                systemConfigVariant: true
                              }
                            },
                            orderDetail: true
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
    });
  }

  async findOne(id: string): Promise<StaffTask> {
    return this.prisma.staffTask.findUnique({
      where: { id },
      include: {
        user: true,
        task: {
          include: {
            checkQualities: {
              include: {
                orderDetail: {
                  include: {
                    order: true,
                    design: true
                  }
                },
                factoryOrderDetail: {
                  include: {
                    factoryOrder: true,
                    design: {
                      include: {
                        user: true,
                        systemConfigVariant: true
                      }
                    },
                    orderDetail: true
                  }
                }
              }
            },
            staffTasks: {
              include: {
                user: true,
                task: {
                  include: {
                    checkQualities: {
                      include: {
                        orderDetail: {
                          include: {
                            order: true,
                            design: true
                          }
                        },
                        factoryOrderDetail: {
                          include: {
                            factoryOrder: true,
                            design: {
                              include: {
                                user: true,
                                systemConfigVariant: true
                              }
                            },
                            orderDetail: true
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
    });
  }

  async findByUserId(userId: string): Promise<StaffTask[]> {
    return this.prisma.staffTask.findMany({
      where: { userId },
      include: {
        user: true,
        task: {
          include: {
            checkQualities: {
              include: {
                orderDetail: {
                  include: {
                    order: true,
                    design: true
                  }
                },
                factoryOrderDetail: {
                  include: {
                    factoryOrder: true,
                    design: {
                      include: {
                        user: true,
                        systemConfigVariant: true
                      }
                    },
                    orderDetail: true
                  }
                }
              }
            },
            staffTasks: {
              include: {
                user: true,
                task: {
                  include: {
                    checkQualities: {
                      include: {
                        orderDetail: {
                          include: {
                            order: true,
                            design: true
                          }
                        },
                        factoryOrderDetail: {
                          include: {
                            factoryOrder: true,
                            design: {
                              include: {
                                user: true,
                                systemConfigVariant: true
                              }
                            },
                            orderDetail: true
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
    });
  }

  async findByTaskId(taskId: string): Promise<StaffTask[]> {
    return this.prisma.staffTask.findMany({
      where: { taskId },
      include: {
        user: true,
        task: {
          include: {
            checkQualities: {
              include: {
                orderDetail: {
                  include: {
                    order: true,
                    design: true
                  }
                },
                factoryOrderDetail: {
                  include: {
                    factoryOrder: true,
                    design: {
                      include: {
                        user: true,
                        systemConfigVariant: true
                      }
                    },
                    orderDetail: true
                  }
                }
              }
            },
            staffTasks: {
              include: {
                user: true,
                task: {
                  include: {
                    checkQualities: {
                      include: {
                        orderDetail: {
                          include: {
                            order: true,
                            design: true
                          }
                        },
                        factoryOrderDetail: {
                          include: {
                            factoryOrder: true,
                            design: {
                              include: {
                                user: true,
                                systemConfigVariant: true
                              }
                            },
                            orderDetail: true
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
    });
  }

  async updateStatus(id: string, status: string): Promise<StaffTask> {
    return this.prisma.staffTask.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        task: {
          include: {
            checkQualities: {
              include: {
                orderDetail: {
                  include: {
                    order: true,
                    design: true
                  }
                },
                factoryOrderDetail: {
                  include: {
                    factoryOrder: true,
                    design: {
                      include: {
                        user: true,
                        systemConfigVariant: true
                      }
                    },
                    orderDetail: true
                  }
                }
              }
            },
            staffTasks: {
              include: {
                user: true,
                task: {
                  include: {
                    checkQualities: {
                      include: {
                        orderDetail: {
                          include: {
                            order: true,
                            design: true
                          }
                        },
                        factoryOrderDetail: {
                          include: {
                            factoryOrder: true,
                            design: {
                              include: {
                                user: true,
                                systemConfigVariant: true
                              }
                            },
                            orderDetail: true
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
    });
  }

  async completeTask(id: string): Promise<StaffTask> {
    return this.prisma.staffTask.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedDate: new Date(),
      },
      include: {
        user: true,
        task: {
          include: {
            checkQualities: {
              include: {
                orderDetail: {
                  include: {
                    order: true,
                    design: true
                  }
                },
                factoryOrderDetail: {
                  include: {
                    factoryOrder: true,
                    design: {
                      include: {
                        user: true,
                        systemConfigVariant: true
                      }
                    },
                    orderDetail: true
                  }
                }
              }
            },
            staffTasks: {
              include: {
                user: true,
                task: {
                  include: {
                    checkQualities: {
                      include: {
                        orderDetail: {
                          include: {
                            order: true,
                            design: true
                          }
                        },
                        factoryOrderDetail: {
                          include: {
                            factoryOrder: true,
                            design: {
                              include: {
                                user: true,
                                systemConfigVariant: true
                              }
                            },
                            orderDetail: true
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
    });
  }
} 