import { SystemConfigVariantEntity } from './../../system-config-variant/entities/system-config-variant.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { DesignPositionEntity } from '../../design-position/entities/design-position.entity';
import { UserEntity } from 'src/users/entities/users.entity';

@ObjectType()
export class ProductDesignEntity {
    @Field(() => ID)
    id: string

    @Field()
    userId: string

    @Field()
    systemConfigVariantId: string

    @Field()
    isFinalized: boolean

    @Field()
    createdAt: Date

    @Field()
    isPublic: boolean

    @Field()
    isTemplate: boolean

    @Field(() => String, { nullable: true })
    thumbnailUrl?: string

    @Field(() => UserEntity, { nullable: true })
    user?: UserEntity

    @Field(() => [DesignPositionEntity], { nullable: true })
    designPositions?: DesignPositionEntity[]

    @Field(() => SystemConfigVariantEntity, { nullable: true })
    systemConfigVariant?: SystemConfigVariantEntity

    constructor(partial: Partial<ProductDesignEntity>) {
        Object.assign(this, partial)
    }
} 